const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CertificateSchema = new Schema({
  number: { type: String, required: true, unique: true, trim: true, index: true },
  imgUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Certificate', CertificateSchema);
