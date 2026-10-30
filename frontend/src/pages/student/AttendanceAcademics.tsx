import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { studentService } from '../../services/api';
import { StudentProfile } from '../../types';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

export const AttendanceAcademics: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulator state: hypothetical classes to attend
  const [targetPercentage, setTargetPercentage] = useState(85);

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

  const att = profile?.attendance.aggregatePercentage || 80;
  const attended = profile?.attendance.attendedClasses || 250;
  const total = profile?.attendance.totalClasses || 320;

  // Simulator: classes needed to hit target percentage
  // (attended + x) / (total + x) = target / 100
  // 100 * attended + 100x = target * total + target * x
  // x * (100 - target) = target * total - 100 * attended
  let classesNeeded = 0;
  if (targetPercentage > att && targetPercentage < 100) {
    const num = targetPercentage * total - 100 * attended;
    const den = 100 - targetPercentage;
    classesNeeded = Math.ceil(Math.max(0, num / den));
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Attendance & Academic Intelligence" subtitle="Institutional attendance audit, condonation policies, and simulator" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Institutional Attendance Policy Alert */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Autonomous Academic Regulation
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Overall Aggregate Attendance: {att}%
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged Classes: {attended} attended out of {total} conducted periods.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  att >= 75 ? 'bg-emerald-100 text-emerald-800' : att >= 65 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {att >= 75 ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <span>{profile?.eligibility.examStatus}</span>
                </span>
              </div>
            </div>

            {/* Attendance Range Breakdown Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase">Safe Zone (&ge; 75%)</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-xs text-emerald-700 mt-2">
                  Regular Hall Ticket clearance granted without condonation or penalty. Maximum 5 marks in internal assessment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase">Condonation (65% - 74.99%)</span>
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-xs text-amber-700 mt-2">
                  Requires submission of Medical Certificate and payment of prescribed Rs. 1,500 condonation fee to Exam Branch.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 uppercase">Detention Zone (&lt; 65%)</span>
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                </div>
                <p className="text-xs text-rose-700 mt-2">
                  Strictly barred from Semester End Examinations. Must repeat the semester with subsequent academic batch.
                </p>
              </div>
            </div>
          </div>

          {/* Subject-Wise Detailed Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Subject-Wise Attendance Ledger</h3>
              <p className="text-xs text-slate-500">Official biometric attendance certified by course instructors</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-6">Subject Code</th>
                    <th className="py-3 px-6">Subject Name</th>
                    <th className="py-3 px-6">Faculty Instructor</th>
                    <th className="py-3 px-6">Attended / Total</th>
                    <th className="py-3 px-6">Percentage</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile?.attendance.subjectWise.map((sub) => (
                    <tr key={sub.subjectCode} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-mono font-bold text-slate-800">{sub.subjectCode}</td>
                      <td className="py-4 px-6 font-semibold text-slate-900">{sub.subjectName}</td>
                      <td className="py-4 px-6 text-slate-600">{sub.faculty}</td>
                      <td className="py-4 px-6 font-medium text-slate-700">{sub.attended} / {sub.total}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{sub.percentage}%</span>
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                sub.percentage >= 75 ? 'bg-emerald-500' : sub.percentage >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          sub.percentage >= 75
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.percentage >= 65
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.percentage >= 75 ? 'Safe' : sub.percentage >= 65 ? 'Warning' : 'Critical'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Goal Simulator */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800">Attendance Target Simulator</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Determine how many consecutive future lectures you must attend to achieve your target percentage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Target Attendance Percentage: {targetPercentage}%
                </label>
                <input
                  type="range"
                  min="65"
                  max="95"
                  step="1"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>65% (Condonation)</span>
                  <span>75% (Safe)</span>
                  <span>85% (Distinction)</span>
                  <span>95% (Honours)</span>
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">To reach your goal of <strong>{targetPercentage}%</strong>:</p>
                  <p className="text-xl font-extrabold text-blue-700 mt-1">
                    {targetPercentage <= att
                      ? `You already have ${att}%, exceeding your target!`
                      : `Attend next ${classesNeeded} classes consecutively without absence.`
                    }
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {targetPercentage <= att ? '✓' : `+${classesNeeded}`}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
