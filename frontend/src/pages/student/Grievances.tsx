import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { grievanceService } from '../../services/api';
import { GrievanceItem } from '../../types';
import {
  HelpCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  X
} from 'lucide-react';

export const Grievances: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Academic',
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await grievanceService.getMyGrievances();
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;

    setSubmitting(true);
    try {
      const res = await grievanceService.submit(formData);
      if (res.data.success) {
        setShowModal(false);
        setFormData({ category: 'Academic', subject: '', description: '', priority: 'Medium' });
        fetchGrievances();
      }
    } catch (err) {
      alert('Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Student Grievance Redressal Portal" subtitle="Submit and track institutional queries, condonation appeals, and facility requests" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Action Header */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Authorized Grievance Redressal Cell
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Your Submitted Grievances ({grievances.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every grievance is assigned a tracking token and reviewed by the academic committee.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Submit New Grievance</span>
            </button>
          </div>

          {/* Grievances List */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-12 flex justify-center bg-white rounded-2xl border border-slate-200">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : grievances.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
                <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No grievances submitted yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "Submit New Grievance" above if you have an inquiry.</p>
              </div>
            ) : (
              grievances.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded">
                        {item.grievanceId}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-base font-bold text-slate-900">{item.subject}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                  </div>

                  {item.adminRemarks ? (
                    <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Administrative Resolution & Remarks:</span>
                        <p className="mt-0.5 text-emerald-800">{item.adminRemarks}</p>
                        <p className="text-[10px] text-emerald-600 mt-1">Handled by: {item.assignedTo || 'Grievance Officer'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Pending committee review. Expected turnaround: 2-3 working days.</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* New Grievance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Submit New Academic Grievance</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Examination">Examination</option>
                    <option value="Placement">Placement</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Condonation application medical certificate verification"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide complete facts, dates, subject codes, or medical reasons..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Grievance'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
