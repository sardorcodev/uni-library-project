const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // <--- SHU QATOR MUHIM
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // SSL kerak
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