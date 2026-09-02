const express = require('express');
const bcrypt = require('bcryptjs');
const { getAsync, allAsync, runAsync } = require('../db');
const { generateToken, authMiddleware } = require('../auth');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    if (typeof userId !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid credential format' });
    }

    const cleanedId = userId.trim().toLowerCase();
    const user = await getAsync('SELECT * FROM users WHERE id = ? AND role = ?', [cleanedId, 'admin']);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    let isValid = false;
    const dbPassword = user.password ? String(user.password) : '';
    
    if (dbPassword.startsWith('$2')) {
      isValid = await bcrypt.compare(password, dbPassword);
    } else {
      isValid = (password === dbPassword);
      if (isValid) {
        try {
          const hashed = await bcrypt.hash(password, 10);
          await runAsync('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
        } catch (hashErr) {
          console.error('Password hash upgrade failed:', hashErr);
          // Don't fail login just because upgrade failed
        }
      }
    }
    
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id, user.role);
    res.cookie('finlit_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000 // 1 hour
    });

    return res.json({ success: true, user: { id: user.id, displayName: user.display_name, role: user.role } });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Logout
router.post('/logout', (req, res) => {
  res.clearCookie('finlit_admin_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
});

// Admin check session
router.get('/me', authMiddleware('admin'), async (req, res) => {
  res.json({ user: req.user });
});

// Get all players
router.get('/players', authMiddleware('admin'), async (req, res) => {
  try {
    const players = await allAsync('SELECT id, display_name, email, avatar_id, level, xp, money, net_worth, health, streak_days, achievements, unlocked_districts FROM users WHERE role = ?', ['player']);
    // Parse JSON fields and numeric fields
    const parsedPlayers = players.map(p => ({
      ...p,
      money: parseFloat(p.money || 0),
      net_worth: parseFloat(p.net_worth || 0),
      achievements: JSON.parse(p.achievements || '[]'),
      unlocked_districts: JSON.parse(p.unlocked_districts || '[]')
    }));
    res.json({ players: parsedPlayers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a player
router.put('/players/:id', authMiddleware('admin'), async (req, res) => {
  const targetId = req.params.id;
  const adminId = req.user.userId;
  const updates = req.body;
  
  const allowedFields = ['xp', 'level', 'money', 'net_worth', 'health', 'streak_days'];
  try {
    const player = await getAsync('SELECT * FROM users WHERE id = ? AND role = ?', [targetId, 'player']);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    for (const [key, newValue] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // Validate type
        if (typeof newValue !== 'number' || newValue < 0) {
          return res.status(400).json({ error: `Invalid value for ${key}` });
        }
        const oldValue = player[key];
        
        await runAsync(`UPDATE users SET ${key} = ? WHERE id = ?`, [newValue, targetId]);
        
        // Log audit event
        await runAsync(
          `INSERT INTO audit_logs (admin_id, target_id, action, field, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?)`,
          [adminId, targetId, 'UPDATE_PLAYER_FIELD', key, String(oldValue), String(newValue)]
        );
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get audit logs
router.get('/audit', authMiddleware('admin'), async (req, res) => {
  try {
    const logs = await allAsync('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
