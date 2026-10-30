const express = require('express');
const router = express.Router();
const { queryRAG, semanticSearch, getChatHistory, clearChatHistory, getAIStatus } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Allow querying with or without auth token
router.post('/query', (req, res, next) => {
  if (req.headers.authorization) {
    protect(req, res, next);
  } else {
    next();
  }
}, queryRAG);

router.post('/retrieve', semanticSearch);
router.get('/history', protect, getChatHistory);
router.delete('/history', protect, clearChatHistory);
router.get('/status', getAIStatus);

module.exports = router;
