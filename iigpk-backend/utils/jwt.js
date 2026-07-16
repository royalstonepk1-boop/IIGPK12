const jwt = require('jsonwebtoken');

const EXPIRES_IN = '7d';

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, adminId: admin.adminId, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
