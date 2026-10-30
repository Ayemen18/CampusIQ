const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'campusiq_super_secret_jwt_key_2026', {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      rollNumber: rollNumber || '',
      department: department || 'CSE - Data Science'
    });

    // If student, create default student profile
    if (user.role === 'student') {
      await StudentProfile.create({
        user: user._id,
        rollNumber: user.rollNumber || `23R21A${Math.floor(1000 + Math.random() * 9000)}`,
        name: user.name,
        email: user.email,
        department: user.department,
        year: 4,
        semester: 7,
        cgpa: 8.2,
        activeBacklogs: 0,
        attendance: {
          aggregatePercentage: 80.0,
          totalClasses: 320,
          attendedClasses: 256,
          subjectWise: [
            { subjectCode: 'CS701PC', subjectName: 'Machine Learning', attended: 44, total: 50, percentage: 88, faculty: 'Mrs. Arshiya Begum', status: 'Safe' },
            { subjectCode: 'DS702PC', subjectName: 'Natural Language Processing', attended: 40, total: 48, percentage: 83.3, faculty: 'Mrs. Arshiya Begum', status: 'Safe' },
            { subjectCode: 'CS703PC', subjectName: 'Cloud Computing', attended: 38, total: 46, percentage: 82.6, faculty: 'Dr. K. Srinivas Rao', status: 'Safe' },
            { subjectCode: 'DS704PE', subjectName: 'Deep Learning', attended: 35, total: 45, percentage: 77.7, faculty: 'Mrs. T. Swathi', status: 'Safe' },
            { subjectCode: 'CS705PC', subjectName: 'Full Stack Development', attended: 46, total: 52, percentage: 88.4, faculty: 'Dr. G. Ravi Chandra', status: 'Safe' }
          ]
        },
        eligibility: {
          examEligible: true,
          examStatus: 'Eligible for Regular Hall Ticket',
          examReason: 'Attendance is above 75% threshold.',
          placementEligible: true,
          placementStatus: 'Eligible for Dream and Core Companies',
          placementReason: 'CGPA 8.2 with zero backlogs.',
          tier1Eligible: true,
          tier2Eligible: true
        },
        recommendations: [
          { category: 'Academic', title: 'Maintain Project Milestone Cadence', description: 'Complete RAG pipeline verification before Stage-1 Review on Dec 8.', priority: 'High' }
        ]
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
