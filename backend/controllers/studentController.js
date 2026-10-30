const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// Helper to compute eligibility and recommendations dynamically
const evaluateInstitutionalRules = (profile) => {
  const attendance = profile.attendance.aggregatePercentage;
  const cgpa = profile.cgpa;
  const backlogs = profile.activeBacklogs;

  // Exam Eligibility Rule
  let examEligible = false;
  let examStatus = '';
  let examReason = '';

  if (attendance >= 75) {
    examEligible = true;
    examStatus = 'Fully Eligible (Regular Hall Ticket)';
    examReason = `Aggregate attendance is ${attendance}%, which satisfies the university requirement (>= 75%).`;
  } else if (attendance >= 65) {
    examEligible = true;
    examStatus = 'Eligible with Medical Condonation';
    examReason = `Attendance is ${attendance}% (between 65% and 74.99%). Requires approved Medical Certificate and payment of Rs. 1,500 condonation fee to Examination Branch.`;
  } else {
    examEligible = false;
    examStatus = 'Detained for Want of Attendance';
    examReason = `Attendance is ${attendance}% (strictly below 65%). Under university regulations, this cannot be condoned and student must repeat the semester.`;
  }

  // Placement Eligibility Rules
  const tier1Eligible = cgpa >= 7.5 && backlogs === 0;
  const tier2Eligible = cgpa >= 6.75 && backlogs === 0;
  const tier3Eligible = cgpa >= 6.0 && backlogs <= 1;

  let placementEligible = tier3Eligible;
  let placementStatus = '';
  let placementReason = '';

  if (tier1Eligible) {
    placementStatus = 'Eligible for Dream & Super Dream Companies (>10 LPA)';
    placementReason = `Outstanding profile with CGPA ${cgpa} and 0 active backlogs. Clears criteria for Tier-1, Tier-2 and Mass recruiters.`;
  } else if (tier2Eligible) {
    placementStatus = 'Eligible for Core & Product Companies (6-10 LPA)';
    placementReason = `Strong academic standing with CGPA ${cgpa} and 0 active backlogs. Clears Tier-2 and Mass recruiters.`;
  } else if (tier3Eligible) {
    placementStatus = 'Eligible for Mass Recruiters & IT Services (3.5-6.0 LPA)';
    placementReason = `Meets minimum CGPA ${cgpa} >= 6.0 with ${backlogs} active backlog. Must clear backlog prior to joining.`;
  } else {
    placementStatus = 'Currently Debarred from Placement Drives';
    placementReason = `CGPA is ${cgpa} (below 6.0) or active backlogs (${backlogs}) exceed maximum permissible limit (1).`;
  }

  // Dynamic recommendations
  const recommendations = [];
  
  // Attendance recommendations
  const lowSubjects = profile.attendance.subjectWise.filter(s => s.percentage < 75);
  if (lowSubjects.length > 0) {
    recommendations.push({
      category: 'Attendance Alert',
      title: `Improve attendance in ${lowSubjects.map(s => s.subjectName).join(', ')}`,
      description: `Your attendance in ${lowSubjects.length} subject(s) is below 75%. Attend the next 6 scheduled classes consecutively to return to the safe green zone.`,
      priority: 'High'
    });
  } else {
    recommendations.push({
      category: 'Attendance',
      title: 'Consistent Attendance Performance',
      description: 'Your attendance across all subjects is in the safe zone. Maintain this consistency to earn maximum internal marks (5/5).',
      priority: 'Low'
    });
  }

  // Academic & Placement recommendations
  if (backlogs > 0) {
    recommendations.push({
      category: 'Examinations',
      title: 'Register for Supplementary Examination',
      description: `You have ${backlogs} pending backlog. Register in the current exam cycle before the registration deadline to regain Tier-1 placement eligibility.`,
      priority: 'High'
    });
  }

  if (cgpa >= 8.0) {
    recommendations.push({
      category: 'Placements',
      title: 'Prepare for Super Dream Coding Assessments',
      description: 'Your CGPA qualifies you for Tier-1 interviews. Focus on LeetCode Medium/Hard Dynamic Programming and Graph algorithms.',
      priority: 'Medium'
    });
  } else {
    recommendations.push({
      category: 'Academic Improvement',
      title: 'Aim for SGPA 8.5+ in Current Semester',
      description: "Securing an A+ in Machine Learning and Full Stack labs will boost your cumulative CGPA into the 8.0+ bracket.",
      priority: 'Medium'
    });
  }

  return {
    examEligible,
    examStatus,
    examReason,
    placementEligible,
    placementStatus,
    placementReason,
    tier1Eligible,
    tier2Eligible,
    recommendations
  };
};

// GET current student's academic profile
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });
    
    // If not found, check by rollNumber or email
    if (!profile) {
      profile = await StudentProfile.findOne({ email: req.user.email });
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Evaluate rules dynamically to guarantee consistency
    const evaluated = evaluateInstitutionalRules(profile);
    profile.eligibility = {
      examEligible: evaluated.examEligible,
      examStatus: evaluated.examStatus,
      examReason: evaluated.examReason,
      placementEligible: evaluated.placementEligible,
      placementStatus: evaluated.placementStatus,
      placementReason: evaluated.placementReason,
      tier1Eligible: evaluated.tier1Eligible,
      tier2Eligible: evaluated.tier2Eligible
    };
    profile.recommendations = evaluated.recommendations;

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET student profile by rollNumber or ID (for Admin or lookup)
exports.getStudentById = async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all students (for Admin)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find().sort({ rollNumber: 1 });
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE student profile (Admin)
exports.updateStudent = async (req, res) => {
  try {
    const profile = await StudentProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const evaluated = evaluateInstitutionalRules(profile);
    profile.eligibility = {
      examEligible: evaluated.examEligible,
      examStatus: evaluated.examStatus,
      examReason: evaluated.examReason,
      placementEligible: evaluated.placementEligible,
      placementStatus: evaluated.placementStatus,
      placementReason: evaluated.placementReason,
      tier1Eligible: evaluated.tier1Eligible,
      tier2Eligible: evaluated.tier2Eligible
    };
    profile.recommendations = evaluated.recommendations;
    await profile.save();

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
