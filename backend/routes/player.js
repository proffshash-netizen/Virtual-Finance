const express = require('express');
const bcrypt = require('bcrypt');
const { getAsync } = require('../db');
const { generateToken, authMiddleware } = require('../auth');

const router = express.Router();

// Player Login
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    const uppercaseId = userId.trim().toUpperCase();
    const user = await getAsync('SELECT * FROM users WHERE id = ? AND role = ?', [uppercaseId, 'player']);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id, user.role);
    res.cookie('finlit_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600000 // 30 days for player
    });

    res.json({ success: true, user: { userId: user.id, displayName: user.display_name, email: user.email, avatarId: user.avatar_id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Player Logout
router.post('/logout', (req, res) => {
  res.clearCookie('finlit_session');
  res.json({ success: true });
});

// Get player state
router.get('/me', authMiddleware('player'), async (req, res) => {
  try {
    const user = await getAsync('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    if (!user) return res.status(404).json({ error: 'Player not found' });

    res.json({
      player: {
        userId: user.id,
        displayName: user.display_name,
        email: user.email,
        avatarId: user.avatar_id
      },
      state: {
        level: user.level,
        xp: user.xp,
        money: user.money,
        netWorth: user.net_worth,
        health: user.health,
        streakDays: user.streak_days,
        achievements: JSON.parse(user.achievements || '[]'),
        unlockedDistricts: JSON.parse(user.unlocked_districts || '[]')
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
