import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { studentService } from '../../services/api';
import { StudentProfile } from '../../types';
import { Users, Search, Edit3, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [editForm, setEditForm] = useState({ cgpa: 8.0, activeBacklogs: 0 });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getAllStudents();
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEditClick = (s: StudentProfile) => {
    setEditingStudent(s);
    setEditForm({ cgpa: s.cgpa, activeBacklogs: s.activeBacklogs });
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    try {
      const res = await studentService.updateStudent(editingStudent._id, editForm);
      if (res.data.success) {
        setEditingStudent(null);
        fetchStudents();
      }
    } catch (err) {
      alert('Failed to update student academic record');
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <div className="flex-1 ml-64">
        <Navbar title="Student Academic Management" subtitle="Roster, institutional rule evaluation, and academic record audits" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Enrolled Student Cohort ({students.length})</h3>
                <p className="text-xs text-slate-500">Autonomous B.Tech VII Semester • CSE - Data Science</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or roll no..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Roll Number</th>
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">Attendance</th>
                    <th className="py-3.5 px-6">CGPA</th>
                    <th className="py-3.5 px-6">Backlogs</th>
                    <th className="py-3.5 px-6">Exam Clearance</th>
                    <th className="py-3.5 px-6">Placement Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-800">{s.rollNumber}</td>
                      <td className="py-4 px-6 font-semibold text-slate-900">{s.name}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          s.attendance.aggregatePercentage >= 75
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.attendance.aggregatePercentage >= 65
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {s.attendance.aggregatePercentage}%
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">{s.cgpa}</td>
                      <td className="py-4 px-6 text-xs font-semibold">{s.activeBacklogs}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.eligibility?.examEligible ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {s.eligibility?.examStatus.split(' ')[0] || 'Eligible'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.eligibility?.tier1Eligible ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {s.eligibility?.tier1Eligible ? 'Tier-1' : s.eligibility?.tier2Eligible ? 'Tier-2' : 'Tier-3'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleEditClick(s)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          Audit Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Record Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Audit Academic Record: {editingStudent.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Roll No: {editingStudent.rollNumber}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={editForm.cgpa}
                  onChange={(e) => setEditForm({ ...editForm, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={editForm.activeBacklogs}
                  onChange={(e) => setEditForm({ ...editForm, activeBacklogs: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Save & Recalculate Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
