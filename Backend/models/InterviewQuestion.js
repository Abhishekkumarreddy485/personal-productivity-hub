const mongoose = require('mongoose');

const InterviewQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String },
    tags: [String],
    module: { type: String, default: 'General' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewQuestion', InterviewQuestionSchema);
