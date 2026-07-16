const Certificate = require('../models/Certificate');

// GET /api/certificates  (admin only — table view in the admin portal)
async function listCertificates(req, res) {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/certificates/:id  (admin only — fetch one for the edit form)
async function getCertificate(req, res) {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Not found' });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/certificates/search/:number  (public — used by the search bar)
async function getCertificateByNumber(req, res) {
  try {
    const cert = await Certificate.findOne({ number: req.params.number.trim() });
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ number: cert.number, imgUrl: cert.imgUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/certificates  (admin only)
async function createCertificate(req, res) {
  try {
    const { number, imgUrl } = req.body;
    if (!number || !imgUrl) {
      return res.status(400).json({ message: 'number and imgUrl are required' });
    }
    const exists = await Certificate.findOne({ number: number.trim() });
    if (exists) return res.status(409).json({ message: 'A certificate with that number already exists' });

    const cert = await Certificate.create({ number: number.trim(), imgUrl });
    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PUT /api/certificates/:id  (admin only)
async function updateCertificate(req, res) {
  try {
    const { number, imgUrl } = req.body;
    const update = {};
    if (number !== undefined) update.number = number.trim();
    if (imgUrl !== undefined) update.imgUrl = imgUrl;

    const cert = await Certificate.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!cert) return res.status(404).json({ message: 'Not found' });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// DELETE /api/certificates/:id  (admin only)
async function deleteCertificate(req, res) {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted', certificate: cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  listCertificates,
  getCertificate,
  getCertificateByNumber,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
