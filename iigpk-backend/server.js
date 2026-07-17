require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// routes (mount)
app.use('/api/admin', require('./routes/adminAuthRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
