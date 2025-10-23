const Quote = require('../models/Quote');
const Book = require('../models/Book');
const { generateCSVBuffer, generatePDFBuffer } = require('../utils/exporters');
const cloudinary = require('../utils/cloudinary');

/**
 * Helper: upload image buffer to Cloudinary
 */
async function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'quotes', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

/**
 * POST /books/:bookId/quotes
 */
// exports.createQuote = async (req, res) => {
//   try {
//     const owner = req.user._id;
//     const bookId = req.params.bookId;
//     const { text } = req.body;

//     if (!text && !req.file) {
//       return res.status(400).json({ message: 'Either text or image is required' });
//     }

//     const book = await Book.findById(bookId);
//     if (!book) return res.status(404).json({ message: 'Book not found' });

//     let imageUrl = null;
//     let imageId = null;

//     if (req.file) {
//       const result = await uploadToCloudinary(req.file.buffer);
//       imageUrl = result.secure_url;
//       imageId = result.public_id;
//     }

//     const quote = await Quote.create({
//       owner,
//       book: bookId,
//       text,
//       imageUrl,
//       imageId,
//     });

//     res.status(201).json(quote);
//   } catch (err) {
//     console.error('Error creating quote:', err);
//     res.status(500).json({ message: 'Server error creating quote' });
//   }
// };

// updated the code for pdfs

/**
 * POST /books/:bookId/quotes
 */
exports.createQuote = async (req, res) => {
  try {
    const owner = req.user._id;
    const bookId = req.params.bookId;
    const { text } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({ message: 'Either text or file is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    let fileUrl = null;
    let fileId = null;
    let fileType = null;

    if (req.file) {
      // 👇 Detect file type based on MIME type
      const isImage = req.file.mimetype.startsWith("image/");
      const isPDF = req.file.mimetype === "application/pdf";

      if (!isImage && !isPDF) {
        return res.status(400).json({ message: "Only images or PDFs are allowed" });
      }

      // 👇 Upload with correct resource_type
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "quotes",
            resource_type: isPDF ? "raw" : "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      fileUrl = result.secure_url;
      fileId = result.public_id;
      fileType = isPDF ? "pdf" : "image";
    }

    const quote = await Quote.create({
      owner,
      book: bookId,
      text,
      fileUrl,
      fileId,
      fileType,
    });

    res.status(201).json(quote);
  } catch (err) {
    console.error("Error creating quote:", err);
    res.status(500).json({ message: "Server error creating quote" });
  }
};


/**
 * GET /books/:bookId/quotes
 */
exports.getQuotesForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const quotes = await Quote.find({ book: bookId }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching quotes' });
  }
};

/** PUT /quotes/:id */

exports.updateQuote = async (req, res) => {
  try {
    let updateData = {};

    // Handle text or favorite if present (works for JSON or FormData text fields)
    if (req.body.text !== undefined) {
      updateData.text = req.body.text;
    }
    if (req.body.favorite !== undefined) {
      updateData.favorite = req.body.favorite;
    }

    // Handle image if provided
    if (req.file) {
      // Find existing quote to delete old image if present
      const quote = await Quote.findById(req.params.id);

      if (quote.imageId) {
        await cloudinary.uploader.destroy(quote.imageId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'quotes',
      });

      updateData.imageUrl = result.secure_url;
      updateData.imageId = result.public_id;
    }

    // If no data was provided, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.json(updatedQuote);
  } catch (error) {
    console.error("Error updating quote:", error);
    res.status(500).json({ message: "Server error updating quote" });
  }
};


/**
 * DELETE /quotes/:id
 */
exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    if (!quote.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Remove image from Cloudinary if exists
    if (quote.imageId) {
      await cloudinary.uploader.destroy(quote.imageId);
    }

    await Quote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quote deleted successfully' });
  } catch (err) {
    console.error('Error deleting quote:', err);
    res.status(500).json({ message: 'Server error deleting quote' });
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
      let out = `Quotes — ${book.title}\n\n`;
      quotes.forEach((q, idx) => {
        out += `${idx + 1}. ${q.text}\n\n`;
      });
      res.setHeader('Content-disposition', `attachment; filename="${book.title || 'book'}-quotes.txt"`);
      res.setHeader('Content-Type', 'text/plain');
      return res.send(out);
    }
  } catch (err) {
    console.error('Error exporting quotes:', err);
    res.status(500).json({ message: 'Server error exporting quotes' });
  }
};
