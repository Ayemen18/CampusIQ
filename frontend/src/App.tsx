import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AskCampusIQ } from './pages/student/AskCampusIQ';
import { DocumentSearch } from './pages/student/DocumentSearch';
import { AcademicAssistance } from './pages/student/AcademicAssistance';
import { AttendanceAcademics } from './pages/student/AttendanceAcademics';
import { ExamSchedules } from './pages/student/ExamSchedules';
import { Placements } from './pages/student/Placements';
import { Notifications } from './pages/student/Notifications';
import { Grievances } from './pages/student/Grievances';
import { MyProfile } from './pages/student/MyProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DocumentManagement } from './pages/admin/DocumentManagement';
import { StudentManagement } from './pages/admin/StudentManagement';
import { UserRoleManagement } from './pages/admin/UserRoleManagement';
import { GrievanceManagement } from './pages/admin/GrievanceManagement';
import { AcademicNotices } from './pages/admin/AcademicNotices';
import { AnalyticsReports } from './pages/admin/AnalyticsReports';
import { SystemSettings } from './pages/admin/SystemSettings';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/ask" element={<AskCampusIQ />} />
            <Route path="/documents" element={<DocumentSearch />} />
            <Route path="/academic-assistance" element={<AcademicAssistance />} />
            <Route path="/attendance" element={<AttendanceAcademics />} />
            <Route path="/exams" element={<ExamSchedules />} />
            <Route path="/placements" element={<Placements />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/grievances" element={<Grievances />} />
            <Route path="/profile" element={<MyProfile />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/documents" element={<DocumentManagement />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route path="/admin/users" element={<UserRoleManagement />} />
            <Route path="/admin/grievances" element={<GrievanceManagement />} />
            <Route path="/admin/notices" element={<AcademicNotices />} />
            <Route path="/admin/analytics" element={<AnalyticsReports />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
