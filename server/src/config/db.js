const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Ulanishni tekshirish
pool.on('connect', () => {
    console.log('✅ Ma\'lumotlar bazasiga muvaffaqiyatli ulandi!');
});

pool.on('error', (err) => {
    console.error('❌ Bazaga ulanishda xatolik:', err);
    process.exit(-1);
});

module.exports = pool;