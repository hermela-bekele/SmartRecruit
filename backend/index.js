const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

// Add connection test on startup
const checkDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('🔌 Successfully connected to PostgreSQL database');
    client.release();
  } catch (err) {
    console.error('💥 Database connection failed:', err);
    process.exit(1);
  }
};

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: err.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Attempting connection to database: ${process.env.DB_NAME}`);
  
  await checkDatabaseConnection();
});