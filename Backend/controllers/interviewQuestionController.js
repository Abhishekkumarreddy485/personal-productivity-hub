// /backend/controllers/interviewQuestionController.js
const InterviewQuestion = require('../models/InterviewQuestion');

// ✅ Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { question, answer, tags } = req.body;

    const newQuestion = new InterviewQuestion({
      question,
      answer,
      tags,
      createdBy: req.user.id
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error('Create Question Error:', err);
    res.status(500).json({ message: 'Failed to create question' });
  }
};

// ✅ List questions (with optional search & pagination)
exports.listQuestions = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = search ? { question: { $regex: search, $options: 'i' } } : {};

    const questions = await InterviewQuestion.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await InterviewQuestion.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      questions,
    });
  } catch (err) {
    console.error('List Questions Error:', err);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

// ✅ Get analytics summary (for admins)
exports.analyticsSummary = async (req, res) => {
  try {
    const totalQuestions = await InterviewQuestion.countDocuments();
    const totalTags = await InterviewQuestion.distinct('tags');
    res.json({ totalQuestions, totalTags: totalTags.length });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// ✅ Get single question by ID
exports.getQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    res.json(question);
  } catch (err) {
    console.error('Get Question Error:', err);
    res.status(500).json({ message: 'Failed to fetch question' });
  }
};

// ✅ Update question
exports.updateQuestion = async (req, res) => {
  try {
    const updated = await InterviewQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('Update Question Error:', err);
    res.status(500).json({ message: 'Failed to update question' });
  }
};

// ✅ Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const deleted = await InterviewQuestion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete Question Error:', err);
    res.status(500).json({ message: 'Failed to delete question' });
  }
};

// ✅ Toggle bookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });

    const userId = req.user.id;
    const index = question.bookmarks.indexOf(userId);

    if (index > -1) {
      question.bookmarks.splice(index, 1); // remove
    } else {
      question.bookmarks.push(userId); // add
    }

    await question.save();
    res.json(question);
  } catch (err) {
    console.error('Toggle Bookmark Error:', err);
    res.status(500).json({ message: 'Failed to toggle bookmark' });
  }
};

// ✅ Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });

    const userId = req.user.id;
    const index = question.favorites.indexOf(userId);

    if (index > -1) {
      question.favorites.splice(index, 1); // remove
    } else {
      question.favorites.push(userId); // add
    }

    await question.save();
    res.json(question);
  } catch (err) {
    console.error('Toggle Favorite Error:', err);
    res.status(500).json({ message: 'Failed to toggle favorite' });
  }
};
