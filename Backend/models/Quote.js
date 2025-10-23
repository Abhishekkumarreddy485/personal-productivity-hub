const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  text: { type: String },
  fileUrl: { type: String },
  fileId: { type: String },
  fileType: { 
    type: String, 
    enum: ['image', 'pdf', null],  // allow null
    default: null                  // no fileType for text-only
  },
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);

