const express = require('express');
const router = express.Router();
const { getAllNotices, createNotice, deleteNotice } = require('../controllers/noticeController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllNotices);
router.post('/', protect, adminOnly, createNotice);
router.delete('/:id', protect, adminOnly, deleteNotice);

module.exports = router;
