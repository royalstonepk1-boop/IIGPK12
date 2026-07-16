/**
 * Promotes an existing user to the 'admin' role by email.
 *
 * Usage:
 *   node scripts/makeAdmin.js someone@example.com
 *
 * The user must have signed in at least once already (via Firebase Auth
 * on the frontend) so their record exists in MongoDB.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findByEmail(email);
  if (!user) {
    console.error(`No user found with email ${email}. Ask them to log in once first.`);
    process.exit(1);
  }

  user.role = 'admin';
  await user.save();

  console.log(`${email} is now an admin.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
