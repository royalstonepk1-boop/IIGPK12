const express = require('express');
const router = express.Router();
const {
  listCertificates,
  getCertificate,
  getCertificateByNumber,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controller/certificateController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Public lookup used by the frontend search bar.
// Registered before "/:id" so it doesn't get swallowed by that route.
router.get('/search/:number', getCertificateByNumber);

// Admin portal — full CRUD, all protected.
router.get('/', authMiddleware, adminOnly, listCertificates);
router.get('/:id', authMiddleware, adminOnly, getCertificate);
router.post('/', authMiddleware, adminOnly, createCertificate);
router.put('/:id', authMiddleware, adminOnly, updateCertificate);
router.delete('/:id', authMiddleware, adminOnly, deleteCertificate);

module.exports = router;
