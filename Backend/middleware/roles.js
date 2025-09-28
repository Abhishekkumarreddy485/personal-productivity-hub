// /backend/middleware/roles.js
// Middleware to check if a logged-in user has a specific role

function requireRole(role) {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'No role information found' });
      }

      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied. Requires role: ' + role });
      }

      next();
    } catch (err) {
      console.error('Role check error:', err);
      res.status(500).json({ message: 'Server error during role check' });
    }
  };
}

module.exports = { requireRole };
