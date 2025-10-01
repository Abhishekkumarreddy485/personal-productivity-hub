const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const quoteCtrl = require('../controllers/quoteController');
const multer = require('multer');

const storage = multer.memoryStorage(); // ✅ keep file in memory
const upload = multer({ storage });

// All routes require authentication
router.use(auth);

// Book-related quotes
router.get('/books/:bookId/quotes', quoteCtrl.getQuotesForBook);
router.get('/books/:bookId/export', quoteCtrl.exportQuotes);
router.post('/books/:bookId/quotes', upload.single('image'), quoteCtrl.createQuote);

// Single quote operations
router.put('/quotes/:id', upload.single('image'), quoteCtrl.updateQuote);
router.delete('/quotes/:id', quoteCtrl.deleteQuote);

module.exports = router;
