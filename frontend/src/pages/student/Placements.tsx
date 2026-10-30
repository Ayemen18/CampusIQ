import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { studentService } from '../../services/api';
import { StudentProfile } from '../../types';
import {
  Briefcase,
  Award,
  CheckCircle2,
  AlertTriangle,
  Building,
  TrendingUp,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

export const Placements: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getMyProfile().then((res) => {
      if (res.data.success) setProfile(res.data.profile);
      setLoading(false);
    });
  }, []);

  const companies = [
    { name: 'Amazon AWS', role: 'Software Development Engineer (SDE)', ctc: '16.5 LPA', tier: 'Tier-1 Dream', cgpaMin: 7.5, backlogs: 0, date: 'Nov 14, 2026', status: 'Registration Open' },
    { name: 'ServiceNow', role: 'Associate Software Engineer', ctc: '14.0 LPA', tier: 'Tier-1 Dream', cgpaMin: 7.5, backlogs: 0, date: 'Nov 18, 2026', status: 'Registration Open' },
    { name: 'Epam Systems', role: 'Junior Software Engineer', ctc: '8.5 LPA', tier: 'Tier-2 Core', cgpaMin: 6.75, backlogs: 0, date: 'Nov 22, 2026', status: 'Upcoming' },
    { name: 'Virtusa', role: 'Cloud Engineer', ctc: '7.0 LPA', tier: 'Tier-2 Core', cgpaMin: 6.75, backlogs: 0, date: 'Nov 26, 2026', status: 'Upcoming' },
    { name: 'TCS Digital', role: 'Systems Engineer', ctc: '7.2 LPA', tier: 'Tier-2 Core', cgpaMin: 6.5, backlogs: 1, date: 'Dec 02, 2026', status: 'Upcoming' },
    { name: 'Cognizant (GenC Next)', role: 'Programmer Analyst', ctc: '6.75 LPA', tier: 'Tier-2 Core', cgpaMin: 6.5, backlogs: 1, date: 'Dec 05, 2026', status: 'Upcoming' }
  ];

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

  const cgpa = profile?.cgpa || 8.0;
  const backlogs = profile?.activeBacklogs || 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Career Development & Placements" subtitle="Company eligibility analytics, recruiter schedules, and institutional policies" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Eligibility Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Placement Eligibility Status
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {profile?.eligibility.placementStatus}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  CGPA: <strong>{cgpa}</strong> • Active Backlogs: <strong>{backlogs}</strong> • Attendance: <strong>{profile?.attendance.aggregatePercentage}%</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Profile Verified by CDC</span>
                </span>
              </div>
            </div>

            {/* Three-Tier Institutional Placement Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className={`p-4 rounded-xl border ${
                cgpa >= 7.5 && backlogs === 0
                  ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Tier-1: Dream (&gt;10 LPA)</span>
                  {cgpa >= 7.5 && backlogs === 0 ? <CheckCircle2 className="h-4 w-4 text-blue-600" /> : <AlertTriangle className="h-4 w-4 text-slate-400" />}
                </div>
                <p className="text-xs mt-2 font-medium">Criteria: CGPA &ge; 7.5 • 0 Backlogs</p>
                <p className="text-[11px] mt-1 text-slate-500">Recruiters: Amazon, ServiceNow, Google, Microsoft, Darwinbox.</p>
                <div className="mt-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    cgpa >= 7.5 && backlogs === 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cgpa >= 7.5 && backlogs === 0 ? 'Eligible' : 'Not Cleared'}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                cgpa >= 6.75 && backlogs === 0
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Tier-2: Core (6-10 LPA)</span>
                  {cgpa >= 6.75 && backlogs === 0 ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-slate-400" />}
                </div>
                <p className="text-xs mt-2 font-medium">Criteria: CGPA &ge; 6.75 • 0 Active Backlogs</p>
                <p className="text-[11px] mt-1 text-slate-500">Recruiters: Epam, Virtusa, TCS Digital, Hexaware, Cognizant.</p>
                <div className="mt-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    cgpa >= 6.75 && backlogs === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cgpa >= 6.75 && backlogs === 0 ? 'Eligible' : 'Not Cleared'}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                cgpa >= 6.0 && backlogs <= 1
                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Tier-3: Mass (3.5-6 LPA)</span>
                  {cgpa >= 6.0 && backlogs <= 1 ? <CheckCircle2 className="h-4 w-4 text-indigo-600" /> : <AlertTriangle className="h-4 w-4 text-slate-400" />}
                </div>
                <p className="text-xs mt-2 font-medium">Criteria: CGPA &ge; 6.0 • Max 1 Backlog</p>
                <p className="text-[11px] mt-1 text-slate-500">Recruiters: TCS Ninja, Wipro Elite, Infosys, Capgemini.</p>
                <div className="mt-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    cgpa >= 6.0 && backlogs <= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cgpa >= 6.0 && backlogs <= 1 ? 'Eligible' : 'Not Cleared'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Policy Note */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 leading-relaxed">
            <strong>One Student One Job Policy Notice:</strong> Under university regulations, once a candidate receives an offer between 3.5 to 6.5 LPA, they are eligible to apply only for companies providing at least 2X compensation (&gt;12 LPA). Debarment applies for unexplained no-show at scheduled recruiter interviews.
          </div>

          {/* Upcoming On-Campus Drives Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Visiting Recruitment Drives (2026-27)</h3>
                <p className="text-xs text-slate-500">Active campus placement drives for VII and VIII semester students</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Company</th>
                    <th className="py-3.5 px-6">Job Role</th>
                    <th className="py-3.5 px-6">Package (CTC)</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Drive Date</th>
                    <th className="py-3.5 px-6">Eligibility</th>
                    <th className="py-3.5 px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((comp, idx) => {
                    const isEligible = cgpa >= comp.cgpaMin && backlogs <= comp.backlogs;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="py-4 px-6 font-bold text-slate-900">{comp.name}</td>
                        <td className="py-4 px-6 font-medium text-slate-800">{comp.role}</td>
                        <td className="py-4 px-6 font-bold text-blue-600">{comp.ctc}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            comp.tier.includes('Dream') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {comp.tier}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600">{comp.date}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isEligible ? 'Eligible' : 'CGPA Criteria'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            disabled={!isEligible}
                            onClick={() => alert(`Registered for ${comp.name} drive. Hall ticket will be sent to ${profile?.email}.`)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
