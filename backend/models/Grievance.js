const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  grievanceId: { type: String, required: true, unique: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  department: { type: String, default: 'CSE - Data Science' },
  category: {
    type: String,
    enum: ['Academic', 'Attendance', 'Examination', 'Placement', 'Hostel', 'Infrastructure', 'Other'],
    required: true
  },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  adminRemarks: { type: String, default: '' },
  assignedTo: { type: String, default: 'Student Grievance Cell' },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grievance', grievanceSchema);
