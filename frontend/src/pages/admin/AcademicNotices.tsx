import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { noticeService } from '../../services/api';
import { NoticeItem } from '../../types';
import { Bell, Plus, Trash2, Calendar, CheckCircle2 } from 'lucide-react';

export const AcademicNotices: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Academic',
    content: '',
    priority: 'Important',
    targetAudience: 'All Final Year B.Tech Students'
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticeService.getAll();
      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    try {
      const res = await noticeService.create(newNotice);
      if (res.data.success) {
        setShowForm(false);
        setNewNotice({
          title: '',
          category: 'Academic',
          content: '',
          priority: 'Important',
          targetAudience: 'All Final Year B.Tech Students'
        });
        fetchNotices();
      }
    } catch (err) {
      alert('Failed to publish notice');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await noticeService.delete(id);
      fetchNotices();
    } catch (err) {
      alert('Failed to delete notice');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <div className="flex-1 ml-64">
        <Navbar title="Academic Announcements & Notice Board" subtitle="Publish official notifications, exam circulars, and departmental directives" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Manage Published Notices ({notices.length})</h2>
              <p className="text-xs text-slate-500 mt-0.5">Notices appear on student dashboards and mobile portals</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>{showForm ? 'Close Form' : 'Publish New Notice'}</span>
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md">
              <h3 className="text-base font-bold text-slate-900 mb-4">Create Official Circular</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                    <select
                      value={newNotice.category}
                      onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Examination">Examination</option>
                      <option value="Placement">Placement</option>
                      <option value="General">General</option>
                      <option value="Hostel">Hostel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Priority</label>
                    <select
                      value={newNotice.priority}
                      onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="Important">Important</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Audience</label>
                    <input
                      type="text"
                      value={newNotice.targetAudience}
                      onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notice Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule of Major Project Stage-1 Internal Reviews"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Circular Body</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter complete directive text..."
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Publish to Student Portal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notices List */}
          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      n.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {n.priority}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {n.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(n.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.content}</p>
                </div>

                <button
                  onClick={() => handleDelete(n._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                  title="Delete notice"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
