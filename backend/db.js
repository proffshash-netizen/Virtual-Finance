const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/finlit'
});

// Prevent Node.js from crashing on idle client errors
pool.on('error', (err, _client) => {
  console.error('Unexpected error on idle client', err);
});

// Helper function to translate SQLite '?' into Postgres '$1', '$2', etc.
const translateSql = (sql) => {
  let count = 1;
  return sql.replace(/\?/g, () => `$${count++}`);
};

const runAsync = async (sql, params = []) => {
  const pgSql = translateSql(sql);
  const result = await pool.query(pgSql, params);
  return result;
};

const getAsync = async (sql, params = []) => {
  const pgSql = translateSql(sql);
  const result = await pool.query(pgSql, params);
  return result.rows[0];
};

const allAsync = async (sql, params = []) => {
  const pgSql = translateSql(sql);
  const result = await pool.query(pgSql, params);
  return result.rows;
};

const initDb = async () => {
  try {
    // 1. Create users table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        password TEXT,
        role TEXT,
        display_name TEXT,
        email TEXT UNIQUE,
        avatar_id TEXT,
        level INTEGER,
        xp INTEGER,
        money NUMERIC(14,2),
        net_worth NUMERIC(14,2),
        health INTEGER,
        streak_days INTEGER,
        achievements TEXT,
        unlocked_districts TEXT
      )
    `);
    try { await runAsync(`ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email)`); } catch {}

    // 2. Create audit logs table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        admin_id TEXT,
        target_id TEXT,
        action TEXT,
        field TEXT,
        old_value TEXT,
        new_value TEXT
      )
    `);

    // 3. Create Portfolio tables
    await runAsync(`
      CREATE TABLE IF NOT EXISTS instruments (
        id TEXT PRIMARY KEY,
        tier TEXT NOT NULL CHECK (tier IN ('foundation','growth','sandbox')),
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        interest_rate NUMERIC(5,2),
        risk_level TEXT,
        volatility NUMERIC(5,2)
      )
    `);

    await runAsync(`
      CREATE TABLE IF NOT EXISTS player_investments (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        instrument_id TEXT NOT NULL REFERENCES instruments(id),
        amount_invested NUMERIC(14,2) NOT NULL,
        current_value NUMERIC(14,2) NOT NULL,
        invested_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    try { await runAsync(`CREATE INDEX idx_player_investments_user ON player_investments(user_id)`); } catch {}

    // 4. Create Security Scenarios tables
    await runAsync(`
      CREATE TABLE IF NOT EXISTS security_scenarios (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        narrative_setup TEXT NOT NULL,
        message_content TEXT NOT NULL,
        correct_answer TEXT NOT NULL CHECK (correct_answer IN ('safe','fraud','verify')),
        difficulty TEXT NOT NULL CHECK (difficulty IN ('obvious','subtle')),
        explanation TEXT NOT NULL,
        xp_reward INTEGER NOT NULL
      )
    `);

    await runAsync(`
      CREATE TABLE IF NOT EXISTS player_scenario_attempts (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scenario_id TEXT NOT NULL REFERENCES security_scenarios(id),
        player_answer TEXT NOT NULL,
        correct BOOLEAN NOT NULL,
        attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    try { await runAsync(`CREATE INDEX idx_scenario_attempts_user ON player_scenario_attempts(user_id)`); } catch {}

    // 5. Create Badges & Leaderboard tables
    await runAsync(`
      CREATE TABLE IF NOT EXISTS badges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon_id TEXT NOT NULL,
        criteria TEXT NOT NULL
      )
    `);

    await runAsync(`
      CREATE TABLE IF NOT EXISTS player_badges (
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_id TEXT NOT NULL REFERENCES badges(id),
        earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, badge_id)
      )
    `);

    await runAsync(`
      CREATE TABLE IF NOT EXISTS net_worth_history (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        net_worth NUMERIC(14,2) NOT NULL,
        recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    try { await runAsync(`CREATE INDEX idx_net_worth_history_user ON net_worth_history(user_id, recorded_at)`); } catch {}


    // -- SEEDS --
    // Admins and Players
    const adminHash = await bcrypt.hash('admin123', 10);
    await runAsync(`INSERT INTO users (id, password, role, display_name) VALUES (?, ?, ?, ?) ON CONFLICT (id) DO NOTHING`,
      ['admin', adminHash, 'admin', 'System Admin']
    );

    const player1Hash = await bcrypt.hash('demo123', 10);
    await runAsync(`INSERT INTO users (id, password, role, display_name, email, avatar_id, level, xp, money, net_worth, health, streak_days, achievements, unlocked_districts) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING`,
      ['FIN001', player1Hash, 'player', 'Shashvanth', 'shashvanth@finlit.demo', 'avatar_01', 18, 4820, 245000, 248500, 78, 12, '["first", "saver"]', '["study", "academy", "investment", "life"]']
    );

    const player2Hash = await bcrypt.hash('demo123', 10);
    await runAsync(`INSERT INTO users (id, password, role, display_name, email, avatar_id, level, xp, money, net_worth, health, streak_days, achievements, unlocked_districts) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING`,
      ['FIN002', player2Hash, 'player', 'Demo Player', 'demo@finlit.demo', 'avatar_02', 5, 1200, 50000, 52000, 100, 2, '["first"]', '["study", "academy"]']
    );

    // Seed Instruments
    await runAsync(`INSERT INTO instruments (id, tier, type, name, interest_rate, risk_level, volatility) VALUES 
      ('sbi_fd', 'foundation', 'FD', 'State Bank Fixed Deposit', 6.5, null, null),
      ('ppf', 'foundation', 'PPF', 'Public Provident Fund', 7.1, null, null),
      ('sbg', 'foundation', 'gold', 'Sovereign Gold Bond', 2.5, null, null),
      ('nifty50', 'growth', 'mutual_fund', 'Nifty 50 Index Fund', null, 'Moderate', null),
      ('reliance', 'growth', 'stock', 'Reliance Industries', null, 'High', null),
      ('tech_startup', 'sandbox', 'startup', 'Tech Startup Fund', null, null, 0.4),
      ('crypto_btc', 'sandbox', 'crypto', 'Bitcoin', null, null, 0.8)
    ON CONFLICT (id) DO NOTHING`);

    // Seed Badges
    await runAsync(`INSERT INTO badges (id, name, description, icon_id, criteria) VALUES 
      ('first_investment', 'First Investment', 'Made your very first investment.', 'first', '1 investment'),
      ('smart_saver', 'Smart Saver', 'Invested in a Foundation tier instrument.', 'saver', '1 foundation investment'),
      ('market_survivor', 'Market Survivor', 'Held a stock through high volatility.', 'survivor', 'Volatility > 0.3'),
      ('risk_manager', 'Risk Manager', 'Correctly identified a fraud scenario.', 'risk', '1 correct scenario'),
      ('fraud_spotter', 'Fraud Spotter', 'Correctly identified 5 fraud scenarios.', 'spotter', '5 correct scenarios')
    ON CONFLICT (id) DO NOTHING`);

    // Seed Security Scenarios
    await runAsync(`INSERT INTO security_scenarios (id, category, narrative_setup, message_content, correct_answer, difficulty, explanation, xp_reward) VALUES 
      ('sec1', 'upi', 'You received a payment request on UPI.', 'Click here to receive Rs.5000 cashback!', 'fraud', 'obvious', 'Never enter your PIN to receive money.', 50),
      ('sec2', 'otp', 'An urgent message claims your bank account is locked.', 'Your account is suspended. Reply with OTP 123456 to unlock.', 'fraud', 'obvious', 'Banks never ask for OTP via SMS replies.', 50),
      ('sec3', 'phishing', 'You got an email from support@banck.com.', 'Update your KYC immediately by clicking this link.', 'fraud', 'subtle', 'Notice the typo in the domain banck.com.', 100),
      ('sec4', 'trading', 'A WhatsApp group invites you to guaranteed returns.', 'Get 200% return in 2 days. Join VIP group.', 'fraud', 'obvious', 'Guaranteed high returns in short time is always a scam.', 50),
      ('sec5', 'caller', 'A caller claims to be from the income tax department.', 'You have unpaid taxes, pay now or face arrest.', 'verify', 'subtle', 'The IT department sends official notices, they do not call threatening arrest.', 100)
    ON CONFLICT (id) DO NOTHING`);

  } catch (err) {
    console.error("Failed to initialize database:", err);
    throw err;
  }
};

module.exports = {
  pool,
  initDb,
  runAsync,
  getAsync,
  allAsync
};
