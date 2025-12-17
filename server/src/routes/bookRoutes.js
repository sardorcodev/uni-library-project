// src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// GET /api/books manziliga murojaat bo'lganda shu funksiya ishlasin
router.get('/', bookController.getAllBooks);
router.post('/borrow', bookController.borrowBook);
router.get('/my-loans/:userId', bookController.getMyLoans); // Mening kitoblarim
router.post('/return', bookController.returnBook);          // Qaytarish
router.post('/add', bookController.addBook);                // Kitob qo'shish

module.exports = router;