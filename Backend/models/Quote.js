const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  text: { type: String },
  imageUrl: { type: String },
  imageId: { type: String }, // ✅ for Cloudinary public_id (needed for delete/update)
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);
