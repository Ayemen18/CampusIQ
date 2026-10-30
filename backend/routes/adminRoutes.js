const express = require('express');
const router = express.Router();
const { getAdminAnalytics, getAllUsers, updateUserRole, getExamSchedules } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/analytics', protect, adminOnly, getAdminAnalytics);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id', protect, adminOnly, updateUserRole);
router.get('/exams', getExamSchedules);

module.exports = router;
