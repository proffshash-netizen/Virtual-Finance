require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { initDb } = require('./db');

const adminRoutes = require('./routes/admin');
const playerRoutes = require('./routes/player');
const guideRoutes = require('./routes/guide');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// In development, we need to allow credentials and specific origins for CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/guide', guideRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', secure: true });
});

// Start Server
const start = async () => {
  try {
    console.log('Initializing database...');
    await initDb();
    console.log('Database initialized successfully.');
    
    app.listen(PORT, () => {
      console.log(`FINLIT Backend Server running on http://localhost:${PORT}`);
      console.log('DEVELOPMENT MODE: SECRETS ARE HARDCODED AND PASSWORDS ARE DEMO ONLY');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
