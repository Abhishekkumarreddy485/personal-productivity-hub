// /backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String },
  year: { type: Number },
  genre: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  summary: { type: String },
  coverImageUrl: { type: String }, // optional
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
