const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. RO'YXATDAN O'TISH (REGISTER)
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Avval bu email bazada bor-yo'qligini tekshiramiz
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "Bu email allaqachon ro'yxatdan o'tgan!" });
        }

        // Parolni shifrlaymiz (Xavfsizlik uchun)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Bazaga yozamiz (Default role = student)
        const newUser = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, email, role',
            [firstName, lastName, email, passwordHash, 'student']
        );

        // Muvaffaqiyatli!
        res.json({ message: "Ro'yxatdan o'tish muvaffaqiyatli!", user: newUser.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server xatosi" });
    }
};

// 2. TIZIMGA KIRISH (LOGIN)
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Email orqali foydalanuvchini qidiramiz
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Email yoki parol noto'g'ri" });
        }

        const user = userResult.rows[0];

        // Parolni tekshiramiz (Kiritilgan parol vs Bazadagi shifr)
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: "Email yoki parol noto'g'ri" });
        }

        // TOKEN YARATAMIZ (Pasport beramiz)
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Token ichida shu ma'lumotlar bo'ladi
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token 1 soat amal qiladi
        );

        res.json({
            message: "Xush kelibsiz!",
            token: token,
            user: {
                id: user.id,
                firstName: user.first_name,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server xatosi" });
    }
};

module.exports = { register, login };