const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  confidence: { type: String, default: 'High' },
  sources: [
    {
      doc_id: String,
      title: String,
      source: String,
      page: Number,
      relevance_score: Number,
      snippet: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
