// /backend/controllers/interviewQuestionController.js
const InterviewQuestion = require('../models/InterviewQuestion');
const mongoose = require('mongoose');
const { getPagination } = require('../utils/pagination');

/**
 * Create a question
 * POST /api/interview-questions
 * body: { title, body, tags (array), module, difficulty, isPublished }
 */
exports.createQuestion = async (req, res) => {
  try {
    const owner = req.user._id;
    const { title, body, tags = [], module, difficulty = 'Medium', isPublished = true } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'title and body are required' });

    const q = await InterviewQuestion.create({
      owner,
      title,
      body,
      tags,
      module,
      difficulty,
      isPublished
    });

    res.status(201).json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * List + search + filter + pagination
 * GET /api/interview-questions
 * Query params:
 *  q (search text)
 *  tag (single tag) or tags (comma separated)
 *  module
 *  difficulty
 *  bookmarked (boolean) -> only return questions bookmarked by current user
 *  favorited (boolean)
 *  owner (user id)
 *  page, limit, sort (e.g. -createdAt)
 */
exports.listQuestions = async (req, res) => {
  try {
    const {
      q,
      tag,
      tags,
      module,
      difficulty,
      bookmarked,
      favorited,
      owner,
      sort = '-createdAt'
    } = req.query;

    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);

    const filter = {};

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    if (tag) filter.tags = tag;
    if (tags) filter.tags = { $in: tags.split(',').map(t => t.trim()) };
    if (module) filter.module = module;
    if (difficulty) filter.difficulty = difficulty;
    if (owner && mongoose.Types.ObjectId.isValid(owner)) filter.owner = owner;

    if (bookmarked === 'true') {
      // questions where bookmarks array contains current user id
      filter.bookmarks = req.user._id;
    }
    if (favorited === 'true') {
      filter.favorites = req.user._id;
    }

    const [items, total] = await Promise.all([
      InterviewQuestion.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('owner', '-passwordHash -email') // lean owner info; adjust fields in your User model
        .lean(),
      InterviewQuestion.countDocuments(filter)
    ]);

    res.json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      items
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get single question
 * GET /api/interview-questions/:id
 */
exports.getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const item = await InterviewQuestion.findById(id).populate('owner', '-passwordHash -email');
    if (!item) return res.status(404).json({ message: 'Not found' });

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update question (owner or admin)
 * PUT /api/interview-questions/:id
 */
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const question = await InterviewQuestion.findById(id);
    if (!question) return res.status(404).json({ message: 'Not found' });

    // Owner or admin check
    const isOwner = question.owner.equals(req.user._id);
    const isAdmin = (req.user.role && req.user.role === 'admin');
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

    // Accept partial updates
    const allowed = ['title', 'body', 'tags', 'module', 'difficulty', 'isPublished'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) question[field] = req.body[field];
    });

    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete question (owner or admin)
 * DELETE /api/interview-questions/:id
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const question = await InterviewQuestion.findById(id);
    if (!question) return res.status(404).json({ message: 'Not found' });

    const isOwner = question.owner.equals(req.user._id);
    const isAdmin = (req.user.role && req.user.role === 'admin');
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

    await InterviewQuestion.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Toggle bookmark for current user
 * POST /api/interview-questions/:id/bookmark
 */
exports.toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const userId = req.user._id;
    const q = await InterviewQuestion.findById(id);
    if (!q) return res.status(404).json({ message: 'Not found' });

    const already = q.bookmarks.some(b => b.equals(userId));
    if (already) {
      q.bookmarks = q.bookmarks.filter(b => !b.equals(userId));
    } else {
      q.bookmarks.push(userId);
    }
    await q.save();
    res.json({ bookmarked: !already, count: q.bookmarks.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Toggle favorite for current user
 * POST /api/interview-questions/:id/favorite
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const userId = req.user._id;
    const q = await InterviewQuestion.findById(id);
    if (!q) return res.status(404).json({ message: 'Not found' });

    const already = q.favorites.some(b => b.equals(userId));
    if (already) {
      q.favorites = q.favorites.filter(b => !b.equals(userId));
    } else {
      q.favorites.push(userId);
    }
    await q.save();
    res.json({ favorited: !already, count: q.favorites.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Simple analytics endpoint (admin)
 * GET /api/interview-questions/analytics/summary
 * Returns counts by tag and module (top N)
 */
exports.analyticsSummary = async (req, res) => {
  try {
    // only admins should reach here; route should be protected by requireRole('admin')
    const topTags = await InterviewQuestion.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const byModule = await InterviewQuestion.aggregate([
      { $group: { _id: '$module', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byDifficulty = await InterviewQuestion.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    res.json({ topTags, byModule, byDifficulty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
