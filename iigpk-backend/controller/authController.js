const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { signToken } = require('../utils/jwt');

// POST /api/admin/login
async function login(req, res) {
  try {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      return res.status(400).json({ message: 'adminId and password are required' });
    }

    const admin = await Admin.findOne({ adminId: adminId.trim() });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(admin);
    res.json({
      token,
      admin: { id: admin._id, adminId: admin.adminId, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { login };
