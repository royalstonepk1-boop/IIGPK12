const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controller/uploadController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/', authMiddleware, adminOnly, upload.single('image'), uploadImage);

module.exports = router;