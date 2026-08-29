const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'finlit.db');
const db = new sqlite3.Database(dbPath);

const initDb = async () => {
  try {
    // Create users table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        password TEXT,
        role TEXT,
        display_name TEXT,
        email TEXT,
        avatar_id TEXT,
        level INTEGER,
        xp INTEGER,
        money INTEGER,
        net_worth INTEGER,
        health INTEGER,
        streak_days INTEGER,
        achievements TEXT,
        unlocked_districts TEXT
      )
    `);

    // Create audit logs table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        admin_id TEXT,
        target_id TEXT,
        action TEXT,
        field TEXT,
        old_value TEXT,
        new_value TEXT
      )
    `);

    // Seed default admin
    const adminHash = await bcrypt.hash('admin123', 10);
    await runAsync(`INSERT OR IGNORE INTO users (id, password, role, display_name) VALUES (?, ?, ?, ?)`,
      ['admin', adminHash, 'admin', 'System Admin']
    );

    // Seed player FIN001
    const player1Hash = await bcrypt.hash('demo123', 10);
    await runAsync(`INSERT OR IGNORE INTO users (id, password, role, display_name, email, avatar_id, level, xp, money, net_worth, health, streak_days, achievements, unlocked_districts) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['FIN001', player1Hash, 'player', 'Shashvanth', 'shashvanth@finlit.demo', 'avatar_01', 18, 4820, 245000, 248500, 78, 12, '["first", "saver"]', '["study", "academy", "investment", "life"]']
    );

    // Seed player FIN002
    const player2Hash = await bcrypt.hash('demo123', 10);
    await runAsync(`INSERT OR IGNORE INTO users (id, password, role, display_name, email, avatar_id, level, xp, money, net_worth, health, streak_days, achievements, unlocked_districts) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['FIN002', player2Hash, 'player', 'Demo Player', 'demo@finlit.demo', 'avatar_02', 5, 1200, 50000, 52000, 100, 2, '["first"]', '["study", "academy"]']
    );

  } catch (err) {
    console.error("Failed to initialize database:", err);
    throw err;
  }
};

const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  initDb,
  runAsync,
  getAsync,
  allAsync
};
