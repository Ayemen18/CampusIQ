import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { noticeService } from '../../services/api';
import { NoticeItem } from '../../types';
import { Bell, Calendar, Tag, AlertCircle, Info } from 'lucide-react';

export const Notifications: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Academic', 'Examination', 'Placement', 'Hostel'];

  useEffect(() => {
    noticeService.getAll(category === 'All' ? undefined : category).then((res) => {
      if (res.data.success) setNotices(res.data.notices);
      setLoading(false);
    });
  }, [category]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Academic Announcements & Notifications" subtitle="Official circulars and directives from university academic offices" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Filter Pills */}
          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  category === c ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Notices Grid */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notices.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                No notifications found in this category.
              </div>
            ) : (
              notices.map((n) => (
                <div key={n._id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow transition">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        n.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : n.priority === 'Important'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {n.priority}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {n.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(n.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">{n.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{n.content}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Issued By: <strong className="text-slate-600">{n.author}</strong></span>
                    <span>Audience: {n.targetAudience}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
