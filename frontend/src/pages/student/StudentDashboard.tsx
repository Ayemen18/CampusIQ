import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { studentService, noticeService } from '../../services/api';
import { StudentProfile, NoticeItem } from '../../types';
import {
  Sparkles,
  CalendarCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowUpRight,
  FileText
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, notRes] = await Promise.all([
          studentService.getMyProfile(),
          noticeService.getAll()
        ]);
        if (profRes.data.success) setProfile(profRes.data.profile);
        if (notRes.data.success) setNotices(notRes.data.notices.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const att = profile?.attendance.aggregatePercentage || 80;
  const isAttSafe = att >= 75;
  const isCondonation = att >= 65 && att < 75;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Student Academic Dashboard" subtitle="Overview of attendance, examinations, and intelligence insights" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Welcome & AI Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span>Autonomous B.Tech • Semester VII • MLRIT</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome, {profile?.name || 'Student'}
                </h1>
                <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Roll No: <span className="font-semibold text-white">{profile?.rollNumber}</span> • {profile?.department} • Mentor: <span className="text-blue-300 font-medium">{profile?.mentor}</span>
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => navigate('/ask')}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Ask CampusIQ AI</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Key Academic Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Attendance Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
                <span className={`p-2 rounded-lg ${isAttSafe ? 'bg-emerald-50 text-emerald-600' : isCondonation ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                  <CalendarCheck className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-slate-900">{att}%</span>
                  <span className="text-xs text-slate-500">
                    ({profile?.attendance.attendedClasses}/{profile?.attendance.totalClasses} classes)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAttSafe ? 'bg-emerald-500' : isCondonation ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(att, 100)}%` }}
                  ></div>
                </div>
                <p className={`mt-2 text-xs font-semibold flex items-center gap-1 ${
                  isAttSafe ? 'text-emerald-700' : isCondonation ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {isAttSafe ? '● Above 75% Safe Threshold' : isCondonation ? '▲ 65-75% Condonation Range' : '✕ Below 65% Detention Zone'}
                </p>
              </div>
            </div>

            {/* CGPA Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative CGPA</span>
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Award className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-slate-900">{profile?.cgpa || 8.0}</span>
                  <span className="text-xs text-slate-500 font-medium">/ 10.0</span>
                </div>
                <div className="mt-3 flex items-center space-x-1 text-xs text-slate-600">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>Sem 6 SGPA: <strong>8.92</strong></span>
                </div>
                <p className="mt-2 text-xs font-semibold text-blue-600">
                  First Class with Distinction
                </p>
              </div>
            </div>

            {/* Exam Eligibility Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exam Clearance</span>
                <span className={`p-2 rounded-lg ${profile?.eligibility.examEligible ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {profile?.eligibility.examEligible ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                </span>
              </div>
              <div className="mt-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                  profile?.eligibility.examEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {profile?.eligibility.examStatus}
                </span>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {profile?.eligibility.examReason}
                </p>
              </div>
            </div>

            {/* Placement Eligibility Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Status</span>
                <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Briefcase className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-3">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">
                  {profile?.eligibility.tier1Eligible ? 'Tier-1 Dream Eligible' : profile?.eligibility.tier2Eligible ? 'Tier-2 Core Eligible' : 'Mass Recruiters'}
                </span>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  Active Backlogs: <strong>{profile?.activeBacklogs}</strong> • Clears criteria for Amazon, Epam, and TCS.
                </p>
              </div>
            </div>
          </div>

          {/* Grid Layout: Subject Breakdown & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject-Wise Attendance Breakdown */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Subject-Wise Attendance Breakdown</h3>
                  <p className="text-xs text-slate-500">Current semester subjects and instructor tracking</p>
                </div>
                <button
                  onClick={() => navigate('/attendance')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Detailed View</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {profile?.attendance.subjectWise.map((sub) => (
                  <div key={sub.subjectCode} className="border border-slate-100 bg-slate-50/50 rounded-xl p-3.5 hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="font-semibold text-slate-800 text-sm">{sub.subjectName}</span>
                        <span className="text-xs text-slate-500 ml-2">({sub.subjectCode})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500 font-medium">{sub.attended}/{sub.total} classes</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          sub.percentage >= 75 ? 'bg-emerald-100 text-emerald-800' : sub.percentage >= 65 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sub.percentage >= 75 ? 'bg-emerald-500' : sub.percentage >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Instructor: {sub.faculty}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Recommendations & Upcoming Deadlines */}
            <div className="space-y-6">
              {/* Recommendations */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span>Personalized Academic Intelligence</span>
                </h3>
                <div className="space-y-3">
                  {profile?.recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-blue-900">{rec.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          rec.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-blue-200/70 text-blue-800'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Notices Snapshot */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-800">Academic Notices</h3>
                  <button onClick={() => navigate('/notifications')} className="text-xs text-blue-600 font-semibold">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n._id} className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {n.category}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{n.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
