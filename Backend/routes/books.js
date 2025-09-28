// /backend/routes/books.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/bookController');

// All book routes are protected
router.use(auth);

router.post('/', bookCtrl.createBook);
router.get('/', bookCtrl.getBooks);
router.get('/:id', bookCtrl.getBookById);
router.put('/:id', bookCtrl.updateBook);
router.delete('/:id', bookCtrl.deleteBook);
router.post('/:id/toggle-favorite', bookCtrl.toggleFavorite);

module.exports = router;
