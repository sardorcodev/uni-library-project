// src/controllers/bookController.js
const pool = require('../config/db');

// Barcha kitoblarni olish
const getAllBooks = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT b.id, b.title, b.isbn, c.name as category, b.published_year, b.available_copies 
            FROM books b
            LEFT JOIN categories c ON b.category_id = c.id
            ORDER BY b.id ASC
        `);
        
        // Natijani mijozga yuboramiz
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
};

const borrowBook = async (req, res) => {
    const { bookId, userId } = req.body;
    
    // Tranzaksiyani boshlaymiz
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Bismillah, boshladik

        // 1. Kitob borligini tekshiramiz
        const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [bookId]);
        
        if (bookCheck.rows.length === 0) {
            throw new Error('Kitob topilmadi');
        }
        
        if (bookCheck.rows[0].available_copies <= 0) {
            throw new Error('Uzr, bu kitob qolmagan');
        }

        // 2. Kitob sonini 1 taga kamaytiramiz
        await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [bookId]);

        // 3. Ijaralar jadvaliga yozamiz (+10 kun muddat bilan)
        await client.query(`
            INSERT INTO loans (user_id, book_id, due_date) 
            VALUES ($1, $2, CURRENT_DATE + INTERVAL '10 days')`, 
            [userId, bookId]
        );

        await client.query('COMMIT'); // Hammasi zo'r, saqla!
        res.json({ message: "Kitob muvaffaqiyatli olindi!" });

    } catch (err) {
        await client.query('ROLLBACK'); // Xatolik bo'ldi, hammasini orqaga qaytar!
        console.error(err);
        res.status(400).json({ error: err.message });
    } finally {
        client.release(); // Ulanishni yopamiz
    }
};
const getMyLoans = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(`
            SELECT l.id, l.book_id, b.title, l.loan_date, l.due_date, l.status 
            FROM loans l
            JOIN books b ON l.book_id = b.id
            WHERE l.user_id = $1
            ORDER BY l.id DESC
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Xatolik" });
    }
};

// 2. Kitobni qaytarish (Return Book)
const returnBook = async (req, res) => {
    const { loanId, bookId } = req.body;
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Ijarani yopamiz (status = returned, vaqt = hozir)
        await client.query(`
            UPDATE loans 
            SET return_date = NOW(), status = 'returned' 
            WHERE id = $1
        `, [loanId]);

        // Kitob sonini 1 taga ko'paytiramiz (Skladga qaytdi)
        await client.query(`
            UPDATE books 
            SET available_copies = available_copies + 1 
            WHERE id = $1
        `, [bookId]);

        await client.query('COMMIT');
        res.json({ message: "Kitob muvaffaqiyatli qaytarildi!" });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Qaytarishda xatolik" });
    } finally {
        client.release();
    }
};
const addBook = async (req, res) => {
    const { title, isbn, categoryId, year, copies } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO books (title, isbn, category_id, published_year, total_copies, available_copies) 
             VALUES ($1, $2, $3, $4, $5, $5) RETURNING *`,
            [title, isbn, categoryId, year, copies]
        );
        
        res.json({ message: "Kitob bazaga qo'shildi!", book: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Kitob qo'shishda xatolik (ISBN takrorlanmasligi kerak!)" });
    }
};

module.exports = {
    getAllBooks,
    borrowBook,
    getMyLoans,
    returnBook,
    addBook
};