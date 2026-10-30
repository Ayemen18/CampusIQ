import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { adminService, studentService } from '../../services/api';
import { ExamScheduleItem, StudentProfile } from '../../types';
import {
  CalendarDays,
  Clock,
  MapPin,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export const ExamSchedules: React.FC = () => {
  const [exams, setExams] = useState<ExamScheduleItem[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getExams(), studentService.getMyProfile()]).then(([examRes, profRes]) => {
      if (examRes.data.success) setExams(examRes.data.schedules);
      if (profRes.data.success) setProfile(profRes.data.profile);
      setLoading(false);
    });
  }, []);

  const handleDownloadHallTicket = () => {
    alert(`Downloading Official Hall Ticket for ${profile?.name} (${profile?.rollNumber}). Attendance verified: ${profile?.attendance.aggregatePercentage}%. Clearance Granted.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Autonomous Examination Schedules" subtitle="Official timetable for B.Tech Semester VII End Examinations" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Hall Ticket Clearance Header */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Examination Cell Clearance Status
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                <span className="text-xs text-slate-500 font-medium">B.Tech VII Semester</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span>Hall Ticket Status:</span>
                <span className={`px-2.5 py-0.5 rounded text-sm ${
                  profile?.eligibility.examEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {profile?.eligibility.examStatus}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {profile?.eligibility.examReason}
              </p>
            </div>

            {profile?.eligibility.examEligible && (
              <button
                onClick={handleDownloadHallTicket}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer shrink-0"
              >
                <Download className="h-4 w-4" />
                <span>Download Hall Ticket</span>
              </button>
            )}
          </div>

          {/* Exam Timetable Cards & Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Semester End Examination Timetable</h3>
              <p className="text-xs text-slate-500">Autonomous theory and practical laboratory exams schedule</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Subject Code</th>
                    <th className="py-3.5 px-6">Subject Name</th>
                    <th className="py-3.5 px-6">Time Slot</th>
                    <th className="py-3.5 px-6">Exam Venue</th>
                    <th className="py-3.5 px-6">Examination Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exams.map((exam) => (
                    <tr key={exam._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-blue-600 shrink-0" />
                          <span>{exam.date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-slate-700">{exam.subjectCode}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">{exam.subjectName}</td>
                      <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{exam.time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{exam.venue}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          exam.type.includes('Lab') || exam.type.includes('Practical')
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {exam.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
