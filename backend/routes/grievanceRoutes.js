const express = require('express');
const router = express.Router();
const { submitGrievance, getMyGrievances, getAllGrievances, updateGrievanceStatus } = require('../controllers/grievanceController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/submit', protect, submitGrievance);
router.get('/my', protect, getMyGrievances);
router.get('/all', protect, adminOnly, getAllGrievances);
router.put('/:id', protect, adminOnly, updateGrievanceStatus);

module.exports = router;
