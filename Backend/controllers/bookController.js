// /backend/controllers/bookController.js
const Book = require('../models/Book');

/**
 * Create book
 */
exports.createBook = async (req, res) => {
  try {
    const owner = req.user._id;
    const payload = { ...req.body, owner };
    const book = await Book.create(payload);
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get books list (with filters: favorite, search)
 */
exports.getBooks = async (req, res) => {
  try {
    const owner = req.user._id;
    const { favorite, q } = req.query;
    const filter = { owner };
    if (favorite === 'true') filter.favorite = true;
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') }, { genre: new RegExp(q, 'i') }];
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.deleteBook = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: 'Book not found' });
//     if (!book.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
//     await book.remove();
//     res.json({ message: 'Deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // check if valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await book.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.toggleFavorite = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    book.favorite = !book.favorite;
    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
