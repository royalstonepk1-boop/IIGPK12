const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  adminId: { type: String, required: true, unique: true, trim: true, index: true },
  password: { type: String, required: true }, // bcrypt hash — never store plaintext
  role: { type: String, enum: ['admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admin', AdminSchema);
