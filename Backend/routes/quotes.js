// /backend/routes/quotes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const quoteCtrl = require('../controllers/quoteController');

// Protected routes
router.use(auth);

// ✅ Routes for quotes related to a book
router.post('/books/:bookId/quotes', quoteCtrl.createQuote);
router.get('/books/:bookId/quotes', quoteCtrl.getQuotesForBook);
router.get('/books/:bookId/export', quoteCtrl.exportQuotes);

// Single-quote operations
router.put('/quotes/:id', quoteCtrl.updateQuote);
router.delete('/quotes/:id', quoteCtrl.deleteQuote);

module.exports = router;
