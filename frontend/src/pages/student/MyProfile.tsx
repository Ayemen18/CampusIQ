import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { studentService } from '../../services/api';
import { StudentProfile } from '../../types';
import {
  User,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  CalendarCheck,
  Building,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getMyProfile().then((res) => {
      if (res.data.success) setProfile(res.data.profile);
      setLoading(false);
    });
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Student Academic Profile" subtitle="Verified university identity, semester transcripts, and performance record" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Identity Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-blue-500/20 shrink-0">
                {profile?.name ? profile.name.charAt(0) : 'S'}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {profile?.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    B.Tech Regular
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 font-medium block">Roll Number</span>
                    <strong className="text-slate-900 font-mono text-sm">{profile?.rollNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Department</span>
                    <strong className="text-slate-900">{profile?.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Semester & Year</span>
                    <strong className="text-slate-900">Year {profile?.year} • Sem {profile?.semester} (Sec {profile?.section})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Faculty Mentor</span>
                    <strong className="text-blue-700">{profile?.mentor}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Transcripts Breakdown (SGPA History) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">Semester Performance Transcripts</h3>
            <p className="text-xs text-slate-500 mb-4">Official grade report per autonomous academic regulation</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {profile?.sgpaHistory.map((s) => (
                <div key={s.semester} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center hover:border-blue-300 transition">
                  <span className="text-xs font-bold text-slate-400 uppercase">Sem {s.semester}</span>
                  <p className="text-xl font-extrabold text-blue-700 mt-1">{s.sgpa}</p>
                  <span className="text-[10px] text-slate-500 font-medium">{s.credits} Credits</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-blue-900">Cumulative Performance Summary:</span>
                <p className="text-blue-800 mt-0.5">
                  CGPA: <strong>{profile?.cgpa}</strong> • Total Credits Earned: <strong>126</strong> • Active Backlogs: <strong>{profile?.activeBacklogs}</strong>
                </p>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                Division: First Class with Distinction
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
