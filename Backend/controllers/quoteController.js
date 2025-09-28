// /backend/controllers/quoteController.js
const Quote = require('../models/Quote');
const Book = require('../models/Book');
const { generateCSVBuffer, generatePDFBuffer } = require('../utils/exporters');

/**
 * POST /books/:bookId/quotes
 */
exports.createQuote = async (req, res) => {
  try {
    const owner = req.user._id;
    const bookId = req.params.bookId;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'text required' });
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const quote = await Quote.create({ owner, book: bookId, text });
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuotesForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const quotes = await Quote.find({ book: bookId }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    if (!quote.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(quote, req.body);
    await quote.save();
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    if (!quote.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    await Quote.findByIdAndDelete(req.params.id);
res.json({ message: 'Deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /books/:bookId/export?format=csv|txt|pdf
 */
exports.exportQuotes = async (req, res) => {
  try {
    const { bookId } = req.params;
    const format = (req.query.format || 'txt').toLowerCase();
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const quotes = await Quote.find({ book: bookId }).sort({ createdAt: -1 });

    if (format === 'csv') {
      const buffer = await generateCSVBuffer(book, quotes);
      res.setHeader('Content-disposition', `attachment; filename="${book.title || 'book'}-quotes.csv"`);
      res.setHeader('Content-Type', 'text/csv');
      return res.send(buffer);
    } else if (format === 'pdf') {
      const buffer = await generatePDFBuffer(book, quotes);
      res.setHeader('Content-disposition', `attachment; filename="${book.title || 'book'}-quotes.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(buffer);
    } else {
      // plain text
      let out = `Quotes — ${book.title}\n\n`;
      quotes.forEach((q, idx) => {
        out += `${idx + 1}. ${q.text}\n\n`;
      });
      res.setHeader('Content-disposition', `attachment; filename="${book.title || 'book'}-quotes.txt"`);
      res.setHeader('Content-Type', 'text/plain');
      return res.send(out);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
