const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'Attendance Policy',
      'Placement Guidelines',
      'Examination Schedule',
      'Academic Calendar',
      'Faculty Directory',
      'Course Catalog',
      'Campus Services',
      'University Holidays',
      'Hostel Regulations',
      'Institutional FAQs',
      'Academic Document',
      'Circular'
    ],
    default: 'Academic Document'
  },
  source: { type: String, required: true },
  fileUrl: { type: String, default: '' },
  chunksCount: { type: Number, default: 1 },
  uploadedBy: { type: String, default: 'Academic Branch' },
  fileSize: { type: String, default: '25 KB' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
