const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Academic', 'Examination', 'Placement', 'General', 'Hostel'],
    default: 'Academic'
  },
  content: { type: String, required: true },
  priority: {
    type: String,
    enum: ['Urgent', 'Important', 'Normal'],
    default: 'Important'
  },
  targetAudience: { type: String, default: 'All Students' },
  author: { type: String, default: 'Dean of Academic Affairs' },
  publishedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Notice', noticeSchema);
