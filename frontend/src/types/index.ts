export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  rollNumber?: string;
  department?: string;
  avatar?: string;
}

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  faculty: string;
  status: 'Safe' | 'Warning' | 'Critical';
}

export interface StudentProfile {
  _id: string;
  rollNumber: string;
  name: string;
  email: string;
  department: string;
  year: number;
  semester: number;
  section: string;
  mentor: string;
  cgpa: number;
  sgpaHistory: { semester: number; sgpa: number; credits: number }[];
  activeBacklogs: number;
  backlogHistory: number;
  attendance: {
    aggregatePercentage: number;
    totalClasses: number;
    attendedClasses: number;
    subjectWise: SubjectAttendance[];
  };
  eligibility: {
    examEligible: boolean;
    examStatus: string;
    examReason: string;
    placementEligible: boolean;
    placementStatus: string;
    placementReason: string;
    tier1Eligible: boolean;
    tier2Eligible: boolean;
  };
  recommendations: {
    category: string;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
}

export interface RAGSource {
  doc_id: string;
  title: string;
  source: string;
  page: number;
  relevance_score: number;
  snippet: string;
}

export interface RAGAnswer {
  query: string;
  answer: string;
  sources: RAGSource[];
  confidence: 'High' | 'Medium' | 'Low';
  category?: string;
  suggested_questions?: string[];
}

export interface DocumentItem {
  _id: string;
  docId: string;
  title: string;
  category: string;
  source: string;
  fileUrl?: string;
  chunksCount: number;
  uploadedBy: string;
  fileSize: string;
  createdAt: string;
}

export interface NoticeItem {
  _id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'Placement' | 'General' | 'Hostel';
  content: string;
  priority: 'Urgent' | 'Important' | 'Normal';
  targetAudience: string;
  author: string;
  publishedDate: string;
}

export interface GrievanceItem {
  _id: string;
  grievanceId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  category: string;
  subject: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  adminRemarks?: string;
  assignedTo?: string;
  submittedAt: string;
}

export interface ExamScheduleItem {
  _id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  department: string;
  date: string;
  time: string;
  venue: string;
  type: string;
}
