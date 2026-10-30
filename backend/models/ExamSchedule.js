const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  department: { type: String, default: 'CSE - Data Science' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  type: { type: String, default: 'Semester End Theory Examination' },
  status: { type: String, default: 'Scheduled' }
});

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
