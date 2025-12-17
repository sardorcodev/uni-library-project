const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db'); // Bazani ulaymiz
const bookRoutes = require('./src/routes/bookRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares (Yordamchilar)
app.use(cors()); // Frontend ulanishi uchun
app.use(express.json()); // JSON ma'lumotlarni tushunish uchun
app.use('/api/books', bookRoutes); // Kitoblar uchun marshrutlar
app.use('/api/auth', authRoutes); // Auth uchun marshrutlar

// TEST ROUTE - Server ishlayotganini tekshirish uchun
app.get('/', (req, res) => {
    res.send('Library API ishlamoqda...');
});

// TEST DATABASE - Bazadan haqiqiy ma'lumot olib ko'rish
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Baza aloqada!', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).send('Bazaga ulanishda xatolik');
    }
});

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`);
});