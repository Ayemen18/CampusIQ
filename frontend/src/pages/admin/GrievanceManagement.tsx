import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { grievanceService } from '../../services/api';
import { GrievanceItem } from '../../types';
import { AlertCircle, CheckCircle2, Clock, MessageSquare, Filter, ShieldCheck, X } from 'lucide-react';

export const GrievanceManagement: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceItem | null>(null);
  const [actionForm, setActionForm] = useState({
    status: 'Resolved',
    adminRemarks: '',
    assignedTo: 'Academic Council Committee'
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await grievanceService.getAllGrievances(statusFilter === 'All' ? undefined : statusFilter);
      if (res.data.success) {
        setGrievances(res.data.grievances);
      }
    } catch (err) {
      console.error('Error fetching grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [statusFilter]);

  const handleOpenAction = (g: GrievanceItem) => {
    setSelectedGrievance(g);
    setActionForm({
      status: g.status === 'Pending' ? 'Resolved' : g.status,
      adminRemarks: g.adminRemarks || '',
      assignedTo: g.assignedTo || 'Academic Council Committee'
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    setIsUpdating(true);
    try {
      const res = await grievanceService.updateStatus(selectedGrievance._id, actionForm);
      if (res.data.success) {
        setSelectedGrievance(null);
        fetchGrievances();
      }
    } catch (err) {
      alert('Failed to update grievance status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <div className="flex-1 ml-64">
        <Navbar title="Grievance Redressal Administration" subtitle="Review student appeals, attendance condonations, and issue official resolutions" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Status Filters */}
          <div className="flex items-center gap-2">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Grievances Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Student Grievances Docket ({grievances.length})</h3>
              <p className="text-xs text-slate-500">Official log of academic, attendance, and administrative grievances</p>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : grievances.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No grievances found matching selected filter.
                </div>
              ) : (
                grievances.map((g) => (
                  <div key={g._id} className="p-6 hover:bg-slate-50/60 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {g.grievanceId}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{g.studentName}</span>
                        <span className="text-xs text-slate-400 font-mono">({g.rollNumber})</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {g.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          g.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.status}
                        </span>
                        <button
                          onClick={() => handleOpenAction(g)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Resolve / Remark
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-800 text-sm mt-2">{g.subject}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{g.description}</p>

                    {g.adminRemarks && (
                      <div className="mt-3 p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl text-xs text-emerald-900">
                        <strong>Official Resolution:</strong> {g.adminRemarks}
                        <span className="block text-[10px] text-emerald-700 mt-0.5">Assigned: {g.assignedTo}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Resolution & Remark Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Triage Grievance: {selectedGrievance.grievanceId}
              </h3>
              <button onClick={() => setSelectedGrievance(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">{selectedGrievance.studentName} ({selectedGrievance.rollNumber})</p>
              <p className="text-slate-600 mt-0.5 font-medium">{selectedGrievance.subject}</p>
            </div>

            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={actionForm.status}
                    onChange={(e) => setActionForm({ ...actionForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Cell</label>
                  <input
                    type="text"
                    value={actionForm.assignedTo}
                    onChange={(e) => setActionForm({ ...actionForm, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Official Administrative Resolution / Remarks
                </label>
                <textarea
                  required
                  rows={3}
                  value={actionForm.adminRemarks}
                  onChange={(e) => setActionForm({ ...actionForm, adminRemarks: e.target.value })}
                  placeholder="e.g. Approved medical condonation upon verification with health center. Hall ticket unblocked."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  {isUpdating ? 'Updating...' : 'Publish Official Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
