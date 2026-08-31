const express = require('express');
const bcrypt = require('bcryptjs');
const { getAsync, runAsync } = require('../db');
const { generateToken, authMiddleware } = require('../auth');

const router = express.Router();

// Player Login
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    if (typeof userId !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid credential format' });
    }

    const uppercaseId = userId.trim().toUpperCase();
    const user = await getAsync('SELECT * FROM users WHERE id = ? AND role = ?', [uppercaseId, 'player']);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    let isValid = false;
    const dbPassword = user.password ? String(user.password) : '';

    if (dbPassword.startsWith('$2')) {
      isValid = await bcrypt.compare(password, dbPassword);
    } else {
      isValid = (password === dbPassword);
      if (isValid) {
        try {
          // Upgrade password to hash
          const hashed = await bcrypt.hash(password, 10);
          await runAsync('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
        } catch (hashErr) {
          console.error('Password hash upgrade failed:', hashErr);
        }
      }
    }
    
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id, user.role, '30d');
    res.cookie('finlit_player_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600000 // 30 days for player
    });

    return res.json({ success: true, user: { userId: user.id, displayName: user.display_name, email: user.email, avatarId: user.avatar_id } });
  } catch (error) {
    console.error('Player login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Player Logout
router.post('/logout', (req, res) => {
  res.clearCookie('finlit_player_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
});

// Player Register
router.post('/register', async (req, res) => {
  const { displayName, email, password, ageConfirmation } = req.body;
  if (!displayName || !email || !password || ageConfirmation !== true) {
    return res.status(400).json({ error: 'Missing fields or age not confirmed' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const newUserId = 'FIN' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // We rely on the UNIQUE constraint on email here.
    // If it violates, Postgres will throw a unique_violation error (code 23505)
    await runAsync(`INSERT INTO users (id, password, role, display_name, email, avatar_id, level, xp, money, net_worth, health, streak_days, achievements, unlocked_districts) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newUserId, hashedPassword, 'player', displayName, email, 'avatar_01', 1, 0, 10000, 10000, 100, 0, '[]', '["study"]']
    );

    const token = generateToken(newUserId, 'player', '30d');
    res.cookie('finlit_player_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600000 // 30 days for player
    });

    res.json({ success: true, user: { userId: newUserId, displayName, email, avatarId: 'avatar_01' } });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
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

// Update player state
router.post('/update', authMiddleware('player'), async (req, res) => {
  const { level, xp, money, netWorth, health, streakDays, achievements } = req.body;
  try {
    const user = await getAsync('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    if (!user) return res.status(404).json({ error: 'Player not found' });
    
    // Only update fields that were provided
    const updateLevel = level !== undefined ? level : user.level;
    const updateXp = xp !== undefined ? xp : user.xp;
    const updateMoney = money !== undefined ? money : user.money;
    const updateNetWorth = netWorth !== undefined ? netWorth : user.net_worth;
    const updateHealth = health !== undefined ? health : user.health;
    const updateStreak = streakDays !== undefined ? streakDays : user.streak_days;
    const updateAchievements = achievements !== undefined ? JSON.stringify(achievements) : user.achievements;
    
    await runAsync('UPDATE users SET level = ?, xp = ?, money = ?, net_worth = ?, health = ?, streak_days = ?, achievements = ? WHERE id = ?', 
      [updateLevel, updateXp, updateMoney, updateNetWorth, updateHealth, updateStreak, updateAchievements, req.user.userId]);
      
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
