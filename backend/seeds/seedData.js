const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Document = require('../models/Document');
const Notice = require('../models/Notice');
const Grievance = require('../models/Grievance');
const ExamSchedule = require('../models/ExamSchedule');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusiq';

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Document.deleteMany({});
    await Notice.deleteMany({});
    await Grievance.deleteMany({});
    await ExamSchedule.deleteMany({});
    console.log('[Seed] Cleared existing records.');

    // 1. Create Users
    const studentUser1 = await User.create({
      name: 'Shaik Abdul Kareem Ayemen',
      email: 'student@campusiq.edu',
      password: 'student123',
      role: 'student',
      rollNumber: '23R21A6754',
      department: 'CSE - Data Science'
    });

    const studentUser2 = await User.create({
      name: 'Sai Krishna',
      email: 'krishna@campusiq.edu',
      password: 'student123',
      role: 'student',
      rollNumber: '23R21A6704',
      department: 'CSE - Data Science'
    });

    const studentUser3 = await User.create({
      name: 'Shaik Sameer Basha',
      email: 'basha@campusiq.edu',
      password: 'student123',
      role: 'student',
      rollNumber: '23R21A6755',
      department: 'CSE - Data Science'
    });

    const adminUser = await User.create({
      name: 'Dr. Arshiya Begum (Admin)',
      email: 'admin@campusiq.edu',
      password: 'admin123',
      role: 'admin',
      department: 'CSE - Data Science'
    });

    console.log('[Seed] Created demo users (Student & Admin).');

    // 2. Create Student Profiles
    // Profile 1: High Performing Student (Ayemen)
    await StudentProfile.create({
      user: studentUser1._id,
      rollNumber: '23R21A6754',
      name: 'Shaik Abdul Kareem Ayemen',
      email: 'student@campusiq.edu',
      department: 'CSE - Data Science',
      year: 4,
      semester: 7,
      section: 'A',
      mentor: 'Mrs. Arshiya Begum',
      cgpa: 8.78,
      sgpaHistory: [
        { semester: 1, sgpa: 8.45, credits: 20 },
        { semester: 2, sgpa: 8.60, credits: 20 },
        { semester: 3, sgpa: 8.75, credits: 21 },
        { semester: 4, sgpa: 8.90, credits: 21 },
        { semester: 5, sgpa: 8.85, credits: 22 },
        { semester: 6, sgpa: 8.92, credits: 22 }
      ],
      activeBacklogs: 0,
      backlogHistory: 0,
      attendance: {
        aggregatePercentage: 86.4,
        totalClasses: 320,
        attendedClasses: 276,
        subjectWise: [
          { subjectCode: 'CS701PC', subjectName: 'Machine Learning', attended: 46, total: 50, percentage: 92.0, faculty: 'Mrs. Arshiya Begum', status: 'Safe' },
          { subjectCode: 'DS702PC', subjectName: 'Natural Language Processing', attended: 44, total: 48, percentage: 91.6, faculty: 'Mrs. Arshiya Begum', status: 'Safe' },
          { subjectCode: 'CS703PC', subjectName: 'Cloud Computing & Virtualization', attended: 39, total: 46, percentage: 84.7, faculty: 'Dr. K. Srinivas Rao', status: 'Safe' },
          { subjectCode: 'DS704PE', subjectName: 'Deep Learning Architectures', attended: 36, total: 45, percentage: 80.0, faculty: 'Mrs. T. Swathi', status: 'Safe' },
          { subjectCode: 'CS705PC', subjectName: 'Full Stack Web Development', attended: 49, total: 52, percentage: 94.2, faculty: 'Dr. G. Ravi Chandra', status: 'Safe' },
          { subjectCode: 'CS706PW', subjectName: 'Major Project Stage-1', attended: 62, total: 79, percentage: 78.4, faculty: 'Mrs. Arshiya Begum', status: 'Safe' }
        ]
      },
      eligibility: {
        examEligible: true,
        examStatus: 'Regular Hall Ticket Clearance Granted',
        examReason: 'Aggregate attendance is 86.4% (satisfies institutional threshold >= 75%).',
        placementEligible: true,
        placementStatus: 'Eligible for Dream & Super Dream Companies (>10 LPA)',
        placementReason: 'CGPA 8.78 >= 7.5 threshold with zero active or historical backlogs.',
        tier1Eligible: true,
        tier2Eligible: true
      },
      recommendations: [
        { category: 'Placement', title: 'Prepare for Tier-1 Super Dream Interviews', description: 'Your CGPA qualifies you for Amazon, ServiceNow, and Google drives. Revise Graph Algorithms and System Design.', priority: 'High' },
        { category: 'Academic', title: 'Major Project Stage-1 Defense Preparation', description: 'Schedule dry run with internal guide Mrs. Arshiya Begum before Dec 8 review.', priority: 'Medium' },
        { category: 'Certification', title: 'NPTEL Cloud Architect Completion', description: 'Submit final assignment for CS703PC auxiliary credit before Nov 15.', priority: 'Low' }
      ]
    });

    // Profile 2: Borderline Student with Condonation Need (Sai Krishna)
    await StudentProfile.create({
      user: studentUser2._id,
      rollNumber: '23R21A6704',
      name: 'Sai Krishna',
      email: 'krishna@campusiq.edu',
      department: 'CSE - Data Science',
      year: 4,
      semester: 7,
      section: 'A',
      mentor: 'Mrs. Arshiya Begum',
      cgpa: 7.62,
      sgpaHistory: [
        { semester: 1, sgpa: 7.20, credits: 20 },
        { semester: 2, sgpa: 7.45, credits: 20 },
        { semester: 3, sgpa: 7.70, credits: 21 },
        { semester: 4, sgpa: 7.50, credits: 21 },
        { semester: 5, sgpa: 7.80, credits: 22 },
        { semester: 6, sgpa: 7.90, credits: 22 }
      ],
      activeBacklogs: 0,
      backlogHistory: 1,
      attendance: {
        aggregatePercentage: 68.5,
        totalClasses: 320,
        attendedClasses: 219,
        subjectWise: [
          { subjectCode: 'CS701PC', subjectName: 'Machine Learning', attended: 35, total: 50, percentage: 70.0, faculty: 'Mrs. Arshiya Begum', status: 'Warning' },
          { subjectCode: 'DS702PC', subjectName: 'Natural Language Processing', attended: 32, total: 48, percentage: 66.6, faculty: 'Mrs. Arshiya Begum', status: 'Warning' },
          { subjectCode: 'CS703PC', subjectName: 'Cloud Computing & Virtualization', attended: 33, total: 46, percentage: 71.7, faculty: 'Dr. K. Srinivas Rao', status: 'Warning' },
          { subjectCode: 'DS704PE', subjectName: 'Deep Learning Architectures', attended: 29, total: 45, percentage: 64.4, faculty: 'Mrs. T. Swathi', status: 'Critical' },
          { subjectCode: 'CS705PC', subjectName: 'Full Stack Web Development', attended: 38, total: 52, percentage: 73.0, faculty: 'Dr. G. Ravi Chandra', status: 'Warning' }
        ]
      },
      eligibility: {
        examEligible: true,
        examStatus: 'Eligible with Medical Condonation',
        examReason: 'Attendance is 68.5% (between 65% and 74.99%). Requires approved Medical Certificate and payment of Rs. 1,500 condonation fee to Examination Branch.',
        placementEligible: true,
        placementStatus: 'Eligible for Core Engineering & Tier-2 Drives (6-10 LPA)',
        placementReason: 'CGPA 7.62 meets criteria; cleared previous backlog.',
        tier1Eligible: false,
        tier2Eligible: true
      },
      recommendations: [
        { category: 'Attendance Alert', title: 'Submit Medical Condonation Application', description: 'Your attendance is 68.5%. Submit medical certificate to HOD office and pay Rs. 1,500 fee before Nov 10 to clear hall ticket.', priority: 'High' },
        { category: 'Academic Alert', title: 'Improve Deep Learning Attendance', description: 'Attendance in DS704PE is 64.4% (below 65% subject cutoff). Attend all remaining remedial classes.', priority: 'High' }
      ]
    });

    // Profile 3: Student with 1 Active Backlog (Sameer Basha)
    await StudentProfile.create({
      user: studentUser3._id,
      rollNumber: '23R21A6755',
      name: 'Shaik Sameer Basha',
      email: 'basha@campusiq.edu',
      department: 'CSE - Data Science',
      year: 4,
      semester: 7,
      section: 'A',
      mentor: 'Mrs. Arshiya Begum',
      cgpa: 6.95,
      sgpaHistory: [
        { semester: 1, sgpa: 6.80, credits: 20 },
        { semester: 2, sgpa: 6.90, credits: 20 },
        { semester: 3, sgpa: 7.10, credits: 21 },
        { semester: 4, sgpa: 6.70, credits: 21 },
        { semester: 5, sgpa: 7.00, credits: 22 },
        { semester: 6, sgpa: 7.20, credits: 22 }
      ],
      activeBacklogs: 1,
      backlogHistory: 1,
      attendance: {
        aggregatePercentage: 78.1,
        totalClasses: 320,
        attendedClasses: 250,
        subjectWise: [
          { subjectCode: 'CS701PC', subjectName: 'Machine Learning', attended: 40, total: 50, percentage: 80.0, faculty: 'Mrs. Arshiya Begum', status: 'Safe' },
          { subjectCode: 'DS702PC', subjectName: 'Natural Language Processing', attended: 38, total: 48, percentage: 79.1, faculty: 'Mrs. Arshiya Begum', status: 'Safe' },
          { subjectCode: 'CS703PC', subjectName: 'Cloud Computing & Virtualization', attended: 36, total: 46, percentage: 78.2, faculty: 'Dr. K. Srinivas Rao', status: 'Safe' },
          { subjectCode: 'DS704PE', subjectName: 'Deep Learning Architectures', attended: 35, total: 45, percentage: 77.7, faculty: 'Mrs. T. Swathi', status: 'Safe' },
          { subjectCode: 'CS705PC', subjectName: 'Full Stack Web Development', attended: 41, total: 52, percentage: 78.8, faculty: 'Dr. G. Ravi Chandra', status: 'Safe' }
        ]
      },
      eligibility: {
        examEligible: true,
        examStatus: 'Regular Hall Ticket Clearance Granted',
        examReason: 'Attendance is 78.1% (Above 75% threshold).',
        placementEligible: true,
        placementStatus: 'Eligible for Mass Recruiters & IT Services (3.5-6.0 LPA)',
        placementReason: 'CGPA 6.95 with 1 active backlog. Clears TCS, Wipro, Infosys, and Cognizant eligibility criteria.',
        tier1Eligible: false,
        tier2Eligible: false
      },
      recommendations: [
        { category: 'Examinations', title: 'Clear Pending Backlog in CS502PC (OS)', description: 'Register for supplementary exam before registration closing date to unblock Tier-1 placement eligibility.', priority: 'High' },
        { category: 'Placement', title: 'Focus on Mass Recruiter Coding Rounds', description: 'Practice Java/Python fundamentals and quantitative aptitude for upcoming TCS Digital and Cognizant drives.', priority: 'Medium' }
      ]
    });

    console.log('[Seed] Created realistic student profiles with institutional rule evaluations.');

    // 3. Seed Knowledge Base Documents (from the 10 JSON files)
    const datasetDir = path.join(__dirname, '../../ai_service/dataset');
    const docCategories = {
      'faculty_information.json': 'Faculty Directory',
      'course_information.json': 'Course Catalog',
      'examination_schedules.json': 'Examination Schedule',
      'academic_calendar.json': 'Academic Calendar',
      'attendance_policies.json': 'Attendance Policy',
      'placement_policies.json': 'Placement Guidelines',
      'campus_services.json': 'Campus Services',
      'holidays.json': 'University Holidays',
      'hostel_information.json': 'Hostel Regulations',
      'faqs.json': 'Institutional FAQs'
    };

    let totalDocsInserted = 0;
    for (const [filename, category] of Object.entries(docCategories)) {
      const filePath = path.join(datasetDir, filename);
      if (fs.existsSync(filePath)) {
        const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const docs = records.map(r => ({
          docId: r.doc_id || `DOC_${Math.random().toString(36).substring(2, 9)}`,
          title: r.title || r.subject || r.course || r.name || r.event || r.service || r.holiday || r.question || r.rule || 'Institutional Document',
          category: category,
          source: filename,
          fileUrl: '',
          chunksCount: 1,
          uploadedBy: 'University Academic Branch',
          fileSize: `${Math.round(JSON.stringify(r).length / 20) + 12} KB`
        }));
        await Document.insertMany(docs);
        totalDocsInserted += docs.length;
      }
    }
    console.log(`[Seed] Seeded ${totalDocsInserted} institutional knowledge base documents into MongoDB.`);

    // 4. Seed Notices
    await Notice.create([
      {
        title: 'Commencement of VII Semester End Theory Examinations - Nov 2026',
        category: 'Examination',
        content: 'The Autonomous Semester End Theory Examinations for B.Tech VII Semester (Regular & Supplementary) are scheduled to commence from November 16, 2026. Hall tickets will be issued through the student portal to all candidates who satisfy the 75% attendance criterion.',
        priority: 'Urgent',
        targetAudience: 'All Final Year B.Tech Students',
        author: 'Controller of Examinations'
      },
      {
        title: 'Attendance Shortage & Condonation Submission Deadline',
        category: 'Academic',
        content: 'Students securing aggregate attendance between 65% and 74.99% must submit their medical certificates along with the prescribed condonation fee of Rs. 1,500 at the Examination Branch on or before November 10, 2026. Detained students (<65%) will not be permitted for exams.',
        priority: 'Important',
        targetAudience: 'All Departments',
        author: 'Dean of Academic Affairs'
      },
      {
        title: 'Upcoming Amazon & ServiceNow On-Campus Placement Drives',
        category: 'Placement',
        content: 'Amazon AWS and ServiceNow will conduct on-campus hiring drives for Software Development Engineer (SDE) roles offering CTC 14-18 LPA on November 14, 2026. Eligibility: CGPA >= 7.5 with 0 active backlogs. Registered candidates must attend mock assessments.',
        priority: 'Important',
        targetAudience: 'CSE, IT & Data Science Final Years',
        author: 'Dean - Career Development Cell'
      },
      {
        title: 'Major Project Stage-1 Review & Demonstration Schedule',
        category: 'Academic',
        content: 'The Department of CSE - Data Science will conduct Major Project Stage-1 Reviews from December 7 to December 10, 2026. Teams must present system architecture, functional modules, and demonstrate working code before the expert panel.',
        priority: 'Important',
        targetAudience: 'CSE - Data Science Students',
        author: 'Project Coordinator (Mrs. Arshiya Begum)'
      },
      {
        title: 'Hostel Curfew & Biometric Verification Strict Compliance',
        category: 'Hostel',
        content: 'All hostel residents are reminded of in-timings: 08:30 PM for Boys Hostel and 07:00 PM for Girls Hostel. Out-passes must be applied 24 hours prior via CampusIQ. Late entry attracts disciplinary action.',
        priority: 'Normal',
        targetAudience: 'Hostel Residents',
        author: 'Chief Hostel Warden'
      }
    ]);
    console.log('[Seed] Seeded academic notices and announcements.');

    // 5. Seed Exam Schedules
    await ExamSchedule.create([
      { subjectCode: 'CS701PC', subjectName: 'Machine Learning', semester: 7, department: 'CSE - Data Science', date: '2026-11-16', time: '10:00 AM - 01:00 PM', venue: 'Block-A Exam Hall 201-205', type: 'Semester End Theory Exam' },
      { subjectCode: 'DS702PC', subjectName: 'Natural Language Processing', semester: 7, department: 'CSE - Data Science', date: '2026-11-18', time: '10:00 AM - 01:00 PM', venue: 'Block-A Exam Hall 201-205', type: 'Semester End Theory Exam' },
      { subjectCode: 'CS703PC', subjectName: 'Cloud Computing & Virtualization', semester: 7, department: 'CSE - Data Science', date: '2026-11-20', time: '10:00 AM - 01:00 PM', venue: 'Block-B Exam Hall 101-105', type: 'Semester End Theory Exam' },
      { subjectCode: 'DS704PE', subjectName: 'Deep Learning & Neural Architectures', semester: 7, department: 'CSE - Data Science', date: '2026-11-23', time: '10:00 AM - 01:00 PM', venue: 'Block-C Central Auditorium', type: 'Semester End Theory Exam' },
      { subjectCode: 'CS705PC', subjectName: 'Full Stack Web Development', semester: 7, department: 'CSE - Data Science', date: '2026-11-25', time: '10:00 AM - 01:00 PM', venue: 'Block-A Exam Halls 301-306', type: 'Semester End Theory Exam' },
      { subjectCode: 'CS706LB', subjectName: 'Machine Learning Practical Lab', semester: 7, department: 'CSE - Data Science', date: '2026-12-01', time: '09:30 AM - 12:30 PM', venue: 'Data Science Lab 1 (Block A)', type: 'External Lab Exam' },
      { subjectCode: 'DS707LB', subjectName: 'NLP & Deep Learning Practical Lab', semester: 7, department: 'CSE - Data Science', date: '2026-12-02', time: '01:30 PM - 04:30 PM', venue: 'AI Innovation Lab (Block B)', type: 'External Lab Exam' }
    ]);
    console.log('[Seed] Seeded examination schedules.');

    // 6. Seed Grievances
    await Grievance.create([
      {
        grievanceId: 'GRV-2026-0001',
        student: studentUser1._id,
        studentName: 'Shaik Abdul Kareem Ayemen',
        rollNumber: '23R21A6754',
        department: 'CSE - Data Science',
        category: 'Academic',
        subject: 'Request for Major Project Laboratory High-GPU Cloud Access',
        description: 'Our project CampusIQ involves fine-tuning Transformer embeddings and running FastAPI semantic retrieval. Requesting additional GPU credits or local lab GPU server allocation for benchmarking.',
        status: 'Resolved',
        priority: 'High',
        adminRemarks: 'Approved by CSE HOD. Assigned Node-4 in Advanced AI Lab with 16GB VRAM for CampusIQ benchmarking.',
        assignedTo: 'AI Lab In-charge',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        grievanceId: 'GRV-2026-0002',
        student: studentUser2._id,
        studentName: 'Sai Krishna',
        rollNumber: '23R21A6704',
        department: 'CSE - Data Science',
        category: 'Attendance',
        subject: 'Condonation Application for Medical Absence (Fever & Dengue Recovery)',
        description: 'Was hospitalized from Sept 14 to Sept 22 due to viral infection, causing attendance to drop to 68.5%. Attaching medical summary and requesting condonation approval.',
        status: 'In Progress',
        priority: 'Urgent',
        adminRemarks: 'Medical certificate received and verified with medical center. Under review by Academic Council for condonation clearance.',
        assignedTo: 'Academic Council Committee',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        grievanceId: 'GRV-2026-0003',
        student: studentUser3._id,
        studentName: 'Shaik Sameer Basha',
        rollNumber: '23R21A6755',
        department: 'CSE - Data Science',
        category: 'Examination',
        subject: 'Re-evaluation Status Verification for Operating Systems (CS502PC)',
        description: 'Applied for revaluation of 5th semester Operating Systems paper in September. Requesting status update on updated grade card.',
        status: 'Pending',
        priority: 'Medium',
        adminRemarks: '',
        assignedTo: 'Examination Branch Counters',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log('[Seed] Seeded grievances.');

    console.log('\n========================================');
    console.log('CampusIQ Database Seed Completed Successfully!');
    console.log('Demo Credentials:');
    console.log('  Student 1: student@campusiq.edu / student123 (Shaik Abdul Kareem Ayemen)');
    console.log('  Student 2: krishna@campusiq.edu / student123 (Sai Krishna)');
    console.log('  Student 3: basha@campusiq.edu   / student123 (Shaik Sameer Basha)');
    console.log('  Admin:     admin@campusiq.edu   / admin123   (Dean & Platform Admin)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
