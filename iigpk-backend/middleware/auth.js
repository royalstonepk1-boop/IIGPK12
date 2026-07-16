const { verifyToken } = require('../utils/jwt');
const Admin = require('../models/Admin');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No authorization header' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid authorization header' });
    }

    const decoded = verifyToken(parts[1]);

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: 'Unauthorized' });

    req.user = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden - admin only' });
  next();
}

module.exports = { authMiddleware, adminOnly };
