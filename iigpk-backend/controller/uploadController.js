const cloudinary = require('../config/cloudinary');

async function uploadImage(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'iigpk/certificates' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: uploaded.secure_url, publicId: uploaded.public_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { uploadImage };