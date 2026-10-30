const express = require('express');
const router = express.Router();
const { getMyProfile, getStudentById, getAllStudents, updateStudent } = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/profile', protect, getMyProfile);
router.get('/all', protect, adminOnly, getAllStudents);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, adminOnly, updateStudent);

module.exports = router;
