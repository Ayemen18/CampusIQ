const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Document = require('../models/Document');
const Grievance = require('../models/Grievance');
const Notice = require('../models/Notice');
const ExamSchedule = require('../models/ExamSchedule');
const ChatMessage = require('../models/ChatMessage');

exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalStudents = await StudentProfile.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalGrievances = await Grievance.countDocuments();
    const pendingGrievances = await Grievance.countDocuments({ status: 'Pending' });
    const resolvedGrievances = await Grievance.countDocuments({ status: 'Resolved' });
    const totalQueries = await ChatMessage.countDocuments();

    // Attendance distribution
    const students = await StudentProfile.find({}, 'attendance cgpa eligibility');
    let attendanceAbove75 = 0;
    let attendance65To75 = 0;
    let attendanceBelow65 = 0;
    let placementEligibleCount = 0;

    students.forEach(s => {
      const att = s.attendance ? s.attendance.aggregatePercentage : 80;
      if (att >= 75) attendanceAbove75++;
      else if (att >= 65) attendance65To75++;
      else attendanceBelow65++;

      if (s.eligibility && s.eligibility.placementEligible) {
        placementEligibleCount++;
      }
    });

    res.json({
      success: true,
      metrics: {
        totalStudents,
        totalUsers,
        totalDocuments,
        totalNotices,
        totalGrievances,
        pendingGrievances,
        resolvedGrievances,
        totalQueries,
        placementEligibleCount,
        placementPercentage: totalStudents > 0 ? Math.round((placementEligibleCount / totalStudents) * 100) : 0,
        attendanceDistribution: {
          safeAbove75: attendanceAbove75,
          condonation65To75: attendance65To75,
          detainedBelow65: attendanceBelow65
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (status) user.status = status;
    await user.save();

    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExamSchedules = async (req, res) => {
  try {
    const schedules = await ExamSchedule.find().sort({ date: 1 });
    res.json({ success: true, count: schedules.length, schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
