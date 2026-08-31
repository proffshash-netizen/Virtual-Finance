const express = require('express');
const { getAsync, allAsync, runAsync, pool } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

// GET /api/portfolio
router.get('/', authMiddleware('player'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await getAsync('SELECT net_worth FROM users WHERE id = ?', [userId]);
    if (!user) return res.status(404).json({ error: 'Player not found' });

    const investments = await allAsync(`
      SELECT p.*, i.tier, i.type, i.name, i.interest_rate, i.risk_level, i.volatility
      FROM player_investments p
      JOIN instruments i ON p.instrument_id = i.id
      WHERE p.user_id = ?
    `, [userId]);

    const allInstruments = await allAsync('SELECT * FROM instruments');

    const tiers = {
      foundation: { instruments: [] },
      growth: { instruments: [] },
      sandbox: { instruments: [] }
    };

    allInstruments.forEach(inst => {
      const playerInv = investments.find(inv => inv.instrument_id === inst.id);
      tiers[inst.tier].instruments.push({
        instrument: {
          id: inst.id,
          type: inst.type,
          name: inst.name,
          interestRate: inst.interest_rate,
          riskLevel: inst.risk_level,
          volatility: inst.volatility
        },
        amountInvested: playerInv ? parseFloat(playerInv.amount_invested) : 0,
        currentValue: playerInv ? parseFloat(playerInv.current_value) : 0
      });
    });

    res.json({
      tiers,
      totalNetWorth: parseFloat(user.net_worth)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/portfolio/invest
router.post('/invest', authMiddleware('player'), async (req, res) => {
  const { tier, instrumentId, amount } = req.body;
  if (!instrumentId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid investment details' });
  }

  const userId = req.user.userId;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get user cash
    const userRes = await client.query('SELECT money, net_worth FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) throw new Error('User not found');
    const user = userRes.rows[0];
    
    if (parseFloat(user.money) < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // 2. Update player investments
    const invRes = await client.query('SELECT * FROM player_investments WHERE user_id = $1 AND instrument_id = $2', [userId, instrumentId]);
    let newAmountInvested, newCurrentValue;
    if (invRes.rows.length > 0) {
      const inv = invRes.rows[0];
      newAmountInvested = parseFloat(inv.amount_invested) + amount;
      newCurrentValue = parseFloat(inv.current_value) + amount;
      await client.query(
        'UPDATE player_investments SET amount_invested = $1, current_value = $2 WHERE id = $3',
        [newAmountInvested, newCurrentValue, inv.id]
      );
    } else {
      newAmountInvested = amount;
      newCurrentValue = amount;
      await client.query(
        'INSERT INTO player_investments (user_id, instrument_id, amount_invested, current_value) VALUES ($1, $2, $3, $4)',
        [userId, instrumentId, amount, amount]
      );
    }

    // 3. Update user money (net worth stays the same because cash -> investment is a net zero change)
    await client.query('UPDATE users SET money = money - $1 WHERE id = $2', [amount, userId]);

    // Note: Net worth doesn't change immediately upon investment.
    
    // Check badges
    await client.query(`
      INSERT INTO player_badges (user_id, badge_id)
      SELECT $1, 'first_investment'
      WHERE NOT EXISTS (SELECT 1 FROM player_badges WHERE user_id = $1 AND badge_id = 'first_investment')
    `, [userId]);

    if (tier === 'foundation') {
      await client.query(`
        INSERT INTO player_badges (user_id, badge_id)
        SELECT $1, 'smart_saver'
        WHERE NOT EXISTS (SELECT 1 FROM player_badges WHERE user_id = $1 AND badge_id = 'smart_saver')
      `, [userId]);
    }

    await client.query('COMMIT');

    const instRes = await client.query('SELECT * FROM instruments WHERE id = $1', [instrumentId]);
    const inst = instRes.rows[0];

    res.json({
      success: true,
      updatedInstrument: {
        instrument: {
          id: inst.id, type: inst.type, name: inst.name, 
          interestRate: inst.interest_rate, riskLevel: inst.risk_level, volatility: inst.volatility
        },
        amountInvested: newAmountInvested,
        currentValue: newCurrentValue
      },
      updatedNetWorth: parseFloat(user.net_worth)
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// POST /api/portfolio/withdraw
router.post('/withdraw', authMiddleware('player'), async (req, res) => {
  const { tier, instrumentId, amount } = req.body;
  if (!instrumentId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal details' });
  }

  const userId = req.user.userId;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Check investment
    const invRes = await client.query('SELECT * FROM player_investments WHERE user_id = $1 AND instrument_id = $2', [userId, instrumentId]);
    if (invRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Investment not found' });
    }
    const inv = invRes.rows[0];
    
    if (parseFloat(inv.current_value) < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient investment balance' });
    }

    // 2. Proportionately reduce amount_invested and current_value
    const currentVal = parseFloat(inv.current_value);
    const invested = parseFloat(inv.amount_invested);
    const ratio = amount / currentVal;
    
    const newCurrentValue = currentVal - amount;
    const newAmountInvested = invested - (invested * ratio);

    if (newCurrentValue < 0.01) {
      // Clean up empty investments
      await client.query('DELETE FROM player_investments WHERE id = $1', [inv.id]);
    } else {
      await client.query(
        'UPDATE player_investments SET amount_invested = $1, current_value = $2 WHERE id = $3',
        [newAmountInvested, newCurrentValue, inv.id]
      );
    }

    // 3. Update user money (Net worth changes if there was profit/loss realized? Actually, net worth = cash + sum(investments). So withdrawing doesn't change net worth, just shifts it to cash).
    const userRes = await client.query('UPDATE users SET money = money + $1 RETURNING net_worth', [amount, userId]);
    
    await client.query('COMMIT');

    const instRes = await client.query('SELECT * FROM instruments WHERE id = $1', [instrumentId]);
    const inst = instRes.rows[0];

    res.json({
      success: true,
      updatedInstrument: {
        instrument: {
          id: inst.id, type: inst.type, name: inst.name, 
          interestRate: inst.interest_rate, riskLevel: inst.risk_level, volatility: inst.volatility
        },
        amountInvested: newAmountInvested,
        currentValue: newCurrentValue
      },
      updatedNetWorth: parseFloat(userRes.rows[0].net_worth)
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
