const express = require('express');
const { allAsync, runAsync, getAsync } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

// GET /api/security-scenarios
router.get('/', authMiddleware('player'), async (req, res) => {
  const { category, difficulty } = req.query;
  
  try {
    let query = 'SELECT id, category, narrative_setup, message_content, difficulty, xp_reward FROM security_scenarios WHERE 1=1';
    const params = [];
    
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    
    if (difficulty) {
      params.push(difficulty);
      query += ` AND difficulty = $${params.length}`;
    }

    const scenarios = await allAsync(query, params);
    
    // Map to camelCase for frontend
    const mappedScenarios = scenarios.map(s => ({
      id: s.id,
      category: s.category,
      narrativeSetup: s.narrative_setup,
      messageContent: s.message_content,
      difficulty: s.difficulty,
      xpReward: s.xp_reward
    }));

    res.json(mappedScenarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/security-scenarios/:id/attempt
router.post('/:id/attempt', authMiddleware('player'), async (req, res) => {
  const { id } = req.params;
  const { playerAnswer } = req.body;
  const userId = req.user.userId;

  if (!playerAnswer) {
    return res.status(400).json({ error: 'Missing player answer' });
  }

  try {
    const scenario = await getAsync('SELECT * FROM security_scenarios WHERE id = ?', [id]);
    if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

    const isCorrect = (playerAnswer === scenario.correct_answer);

    // Record attempt
    await runAsync(
      'INSERT INTO player_scenario_attempts (user_id, scenario_id, player_answer, correct) VALUES (?, ?, ?, ?)',
      [userId, id, playerAnswer, isCorrect]
    );

    let xpAwarded = 0;
    if (isCorrect) {
      xpAwarded = scenario.xp_reward;
      await runAsync('UPDATE users SET xp = xp + ? WHERE id = ?', [xpAwarded, userId]);
      
      // Badges check
      const correctCountRes = await getAsync('SELECT COUNT(*) as count FROM player_scenario_attempts WHERE user_id = ? AND correct = true', [userId]);
      const count = parseInt(correctCountRes.count, 10);
      
      if (count >= 1) {
        await runAsync(`INSERT INTO player_badges (user_id, badge_id) VALUES (?, 'risk_manager') ON CONFLICT DO NOTHING`, [userId]);
      }
      if (count >= 5) {
        await runAsync(`INSERT INTO player_badges (user_id, badge_id) VALUES (?, 'fraud_spotter') ON CONFLICT DO NOTHING`, [userId]);
      }
    }

    res.json({
      correct: isCorrect,
      correctAnswer: scenario.correct_answer,
      explanation: scenario.explanation,
      xpAwarded
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
