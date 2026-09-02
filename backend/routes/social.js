const express = require('express');
const { allAsync } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

// GET /api/badges
router.get('/badges', authMiddleware('player'), async (req, res) => {
  const userId = req.user.userId;
  try {
    const allBadges = await allAsync('SELECT * FROM badges');
    const userBadges = await allAsync('SELECT badge_id, earned_at FROM player_badges WHERE user_id = ?', [userId]);

    const mapped = allBadges.map(b => {
      const earned = userBadges.find(ub => ub.badge_id === b.id);
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        iconId: b.icon_id,
        criteria: b.criteria,
        earnedAt: earned ? earned.earned_at : null
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leaderboard
router.get('/leaderboard', authMiddleware('player'), async (req, res) => {
  const { metric } = req.query; // 'lowest_drawdown' | 'diversification' | 'consistency'
  
  try {
    let results = [];
    
    if (metric === 'lowest_drawdown') {
      // Find the max drawdown percentage per user
      const query = `
        WITH user_history AS (
          SELECT 
            user_id, 
            net_worth, 
            MAX(net_worth) OVER (PARTITION BY user_id ORDER BY recorded_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as peak_net_worth
          FROM net_worth_history
        ),
        drawdowns AS (
          SELECT 
            user_id,
            CASE WHEN peak_net_worth > 0 THEN ((peak_net_worth - net_worth) / peak_net_worth) * 100 ELSE 0 END as drawdown
          FROM user_history
        ),
        max_drawdowns AS (
          SELECT user_id, MAX(drawdown) as max_drawdown
          FROM drawdowns
          GROUP BY user_id
        )
        SELECT u.id as user_id, u.display_name, u.avatar_id, COALESCE(md.max_drawdown, 0) as metric_value
        FROM users u
        LEFT JOIN max_drawdowns md ON u.id = md.user_id
        WHERE u.role = 'player'
        ORDER BY metric_value ASC
        LIMIT 50;
      `;
      const rows = await allAsync(query);
      results = rows.map((r, idx) => ({
        userId: r.user_id,
        displayName: r.display_name,
        avatarId: r.avatar_id,
        rank: idx + 1,
        metricValue: parseFloat(r.metric_value).toFixed(2) + '%',
        metricLabel: 'Max Drawdown',
        isCurrentUser: r.user_id === req.user.userId
      }));
    } else if (metric === 'diversification') {
      // Count unique tiers invested in as a simple diversification score
      const query = `
        WITH user_tiers AS (
          SELECT pi.user_id, COUNT(DISTINCT i.tier) as unique_tiers
          FROM player_investments pi
          JOIN instruments i ON pi.instrument_id = i.id
          WHERE pi.current_value > 0
          GROUP BY pi.user_id
        )
        SELECT u.id as user_id, u.display_name, u.avatar_id, COALESCE(ut.unique_tiers, 0) as metric_value
        FROM users u
        LEFT JOIN user_tiers ut ON u.id = ut.user_id
        WHERE u.role = 'player'
        ORDER BY metric_value DESC
        LIMIT 50;
      `;
      const rows = await allAsync(query);
      results = rows.map((r, idx) => ({
        userId: r.user_id,
        displayName: r.display_name,
        avatarId: r.avatar_id,
        rank: idx + 1,
        metricValue: parseInt(r.metric_value, 10),
        metricLabel: 'Tiers Active',
        isCurrentUser: r.user_id === req.user.userId
      }));
    } else {
      // Default to consistency (streak)
      const query = `
        SELECT id as user_id, display_name, avatar_id, streak_days as metric_value
        FROM users
        WHERE role = 'player'
        ORDER BY streak_days DESC
        LIMIT 50;
      `;
      const rows = await allAsync(query);
      results = rows.map((r, idx) => ({
        userId: r.user_id,
        displayName: r.display_name,
        avatarId: r.avatar_id,
        rank: idx + 1,
        metricValue: parseInt(r.metric_value, 10),
        metricLabel: 'Day Streak',
        isCurrentUser: r.user_id === req.user.userId
      }));
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
