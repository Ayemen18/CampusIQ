import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { adminService, grievanceService } from '../../services/api';
import {
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentGrievances, setRecentGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([adminService.getAnalytics(), grievanceService.getAllGrievances()])
      .then(([analyticsRes, grvRes]) => {
        if (analyticsRes.data.success) setMetrics(analyticsRes.data.metrics);
        if (grvRes.data.success) setRecentGrievances(grvRes.data.grievances.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar isAdmin />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const attDist = metrics?.attendanceDistribution || { safeAbove75: 2, condonation65To75: 1, detainedBelow65: 0 };
  const totalStudents = metrics?.totalStudents || 3;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <div className="flex-1 ml-64">
        <Navbar title="University Administration & Intelligence Control" subtitle="CampusIQ Central Academic Oversight & RAG Engine Telemetry" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Admin Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-2">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>Executive Administration Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Academic Operations & Intelligence Overview
              </h1>
              <p className="mt-1 text-xs text-slate-300 max-w-xl">
                Real-time monitoring of institutional knowledge base, attendance compliance, placement eligibility, and student grievances.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/admin/documents')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Upload Document</span>
              </button>
              <button
                onClick={() => navigate('/admin/notices')}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
              >
                <span>Publish Notice</span>
              </button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-extrabold text-slate-900">{metrics?.totalStudents || 3}</span>
                <p className="text-xs text-slate-500 mt-1">Verified Student Profiles</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Indexed Knowledge</span>
                <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <FileText className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-extrabold text-slate-900">{metrics?.totalDocuments || 190}</span>
                <p className="text-xs text-slate-500 mt-1">RAG Chunks in Vector Store</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Grievances</span>
                <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-extrabold text-amber-600">{metrics?.pendingGrievances || 1}</span>
                <p className="text-xs text-slate-500 mt-1">Requiring Committee Review</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Eligible</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-extrabold text-emerald-600">{metrics?.placementPercentage || 100}%</span>
                <p className="text-xs text-slate-500 mt-1">Cleared CGPA & Backlogs</p>
              </div>
            </div>
          </div>

          {/* Grid Layout: Attendance Compliance & Grievance Triage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Compliance Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1">Institutional Attendance Compliance</h3>
              <p className="text-xs text-slate-500 mb-4">Batch distribution against semester exam rules</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-700">Safe Zone (&ge; 75%)</span>
                    <span>{attDist.safeAbove75} Students ({Math.round((attDist.safeAbove75 / totalStudents) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(attDist.safeAbove75 / totalStudents) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-700">Condonation Window (65% - 74.99%)</span>
                    <span>{attDist.condonation65To75} Students ({Math.round((attDist.condonation65To75 / totalStudents) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(attDist.condonation65To75 / totalStudents) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-700">Detained (&lt; 65%)</span>
                    <span>{attDist.detainedBelow65} Students ({Math.round((attDist.detainedBelow65 / totalStudents) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(attDist.detainedBelow65 / totalStudents) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800">Rule Engine Note:</span> Students in the condonation window have been sent automated SMS alerts regarding the Rs. 1,500 fee deadline.
              </div>
            </div>

            {/* Grievance Redressal Triage */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Recent Student Grievances</h3>
                  <p className="text-xs text-slate-500">Active submissions awaiting committee review</p>
                </div>
                <button
                  onClick={() => navigate('/admin/grievances')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Manage All Grievances →
                </button>
              </div>

              <div className="space-y-3">
                {recentGrievances.map((g) => (
                  <div key={g._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {g.grievanceId}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {g.studentName} ({g.rollNumber})
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          {g.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1">{g.subject}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        g.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.status}
                      </span>
                      <button
                        onClick={() => navigate('/admin/grievances')}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Action
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
