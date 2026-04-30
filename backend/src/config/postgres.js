const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const connectPostgres = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL Connected');

    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS incidents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        component_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        severity VARCHAR(50) CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')) DEFAULT 'HIGH',
        status VARCHAR(50) CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')) DEFAULT 'OPEN',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log('PostgreSQL Schema Initialized');
  } catch (err) {
    console.error('PostgreSQL Connection/Initialization Error:', err.message);
    process.exit(1);
  }
};

module.exports = { pool, connectPostgres };