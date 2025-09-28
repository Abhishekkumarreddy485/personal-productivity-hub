// /backend/routes/interviewQuestions.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const ctrl = require('../controllers/interviewQuestionController');

// ✅ All routes require authentication
router.use(auth);

// Create new interview question
router.post('/', ctrl.createQuestion);

// List / search / filter / paginate questions
router.get('/', ctrl.listQuestions);

// Analytics (admin only)
router.get('/analytics/summary', requireRole('admin'), ctrl.analyticsSummary);

// Get single question by ID
router.get('/:id', ctrl.getQuestion);

// Update & delete question
router.put('/:id', ctrl.updateQuestion);
router.delete('/:id', ctrl.deleteQuestion);

// Bookmark & favorite toggles
router.post('/:id/bookmark', ctrl.toggleBookmark);
router.post('/:id/favorite', ctrl.toggleFavorite);

module.exports = router;
