const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllDocuments, uploadDocument, deleteDocument } = require('../controllers/documentController');
const { protect, adminOnly } = require('../middleware/auth');

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB max
});

router.get('/', getAllDocuments);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadDocument);
router.delete('/:id', protect, adminOnly, deleteDocument);

module.exports = router;
