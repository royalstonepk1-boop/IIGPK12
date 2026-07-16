/**
 * Creates (or updates the password for) an admin account.
 *
 * Usage:
 *   node scripts/createAdmin.js <adminId> <password>
 *
 * Example:
 *   node scripts/createAdmin.js owner@iigpk.com "a-strong-password"
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function run() {
  const [adminId, password] = process.argv.slice(2);
  if (!adminId || !password) {
    console.error('Usage: node scripts/createAdmin.js <adminId> <password>');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Password should be at least 8 characters.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const hash = await bcrypt.hash(password, 12);
  const admin = await Admin.findOneAndUpdate(
    { adminId: adminId.trim() },
    { adminId: adminId.trim(), password: hash },
    { upsert: true, new: true }
  );

  console.log(`Admin ready: ${admin.adminId}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
