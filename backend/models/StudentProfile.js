const mongoose = require('mongoose');

const subjectAttendanceSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  attended: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  faculty: { type: String, default: '' },
  status: { type: String, enum: ['Safe', 'Warning', 'Critical'], default: 'Safe' }
});

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, default: 'CSE - Data Science' },
  year: { type: Number, default: 4 },
  semester: { type: Number, default: 7 },
  section: { type: String, default: 'A' },
  mentor: { type: String, default: 'Mrs. Arshiya Begum' },
  cgpa: { type: Number, default: 8.42 },
  sgpaHistory: [
    { semester: Number, sgpa: Number, credits: Number }
  ],
  activeBacklogs: { type: Number, default: 0 },
  backlogHistory: { type: Number, default: 0 },
  attendance: {
    aggregatePercentage: { type: Number, default: 82.5 },
    totalClasses: { type: Number, default: 320 },
    attendedClasses: { type: Number, default: 264 },
    subjectWise: [subjectAttendanceSchema]
  },
  eligibility: {
    examEligible: { type: Boolean, default: true },
    examStatus: { type: String, default: 'Eligible for Regular Hall Ticket' },
    examReason: { type: String, default: 'Overall attendance is 82.5% (Above mandatory 75% threshold).' },
    placementEligible: { type: Boolean, default: true },
    placementStatus: { type: String, default: 'Eligible for Dream & Core Recruiter Drives' },
    placementReason: { type: String, default: 'CGPA 8.42 >= 7.5 threshold with 0 active backlogs.' },
    tier1Eligible: { type: Boolean, default: true },
    tier2Eligible: { type: Boolean, default: true }
  },
  recommendations: [
    {
      category: { type: String, default: 'Academic' },
      title: { type: String, required: true },
      description: { type: String, required: true },
      priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
