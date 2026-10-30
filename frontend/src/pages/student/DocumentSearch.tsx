import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { documentService, ragService } from '../../services/api';
import { DocumentItem } from '../../types';
import {
  Search,
  Filter,
  FileText,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export const DocumentSearch: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [semanticResults, setSemanticResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const categories = [
    'All',
    'Attendance Policy',
    'Placement Guidelines',
    'Examination Schedule',
    'Academic Calendar',
    'Faculty Directory',
    'Course Catalog',
    'Campus Services',
    'University Holidays',
    'Hostel Regulations',
    'Institutional FAQs'
  ];

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getAll(category === 'All' ? undefined : category, searchQuery);
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [category]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSemanticResults([]);
      fetchDocs();
      return;
    }

    setIsSearching(true);
    try {
      // Run semantic vector search
      const semRes = await ragService.retrieve(searchQuery.trim(), 8);
      if (semRes.data.success) {
        setSemanticResults(semRes.data.documents);
      }
    } catch (err) {
      console.warn('Semantic search fallback to keyword:', err);
      fetchDocs();
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Institutional Document Search" subtitle="Explore indexed university regulations, syllabi, circulars, and FAQs" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Search Header Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter keywords or ask questions (e.g., 'placement eligibility', 'attendance condonation', 'exam schedules')..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSearching ? 'Searching...' : 'Semantic Search'}</span>
              </button>
            </form>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto mt-4 pt-3 border-t border-slate-100 no-scrollbar">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition ${
                    category === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Semantic Search Results (if available) */}
          {semanticResults.length > 0 && (
            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span>Semantic Vector Matches for: "{searchQuery}"</span>
                </div>
                <button
                  onClick={() => setSemanticResults([])}
                  className="text-xs font-medium text-blue-700 hover:underline"
                >
                  Clear Semantic Filter
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {semanticResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedDoc(item)}
                    className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:border-blue-400 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {Math.round(item.score * 100)}% Match
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.content}</p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Doc: {item.doc_id}</span>
                      <span>Source: {item.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Knowledge Base Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Indexed Knowledge Records ({documents.length})
                </h3>
                <p className="text-xs text-slate-500">Official university dataset records accessible to CampusIQ AI</p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : documents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No documents found matching current filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => setSelectedDoc(doc)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition bg-white flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                          {doc.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-medium">
                          {doc.docId}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        Source File: {doc.source}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{doc.uploadedBy}</span>
                      <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition">
                        Inspect Record →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Document Inspection Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                {selectedDoc.category}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-3">{selectedDoc.title}</h3>
            <p className="text-xs font-mono text-slate-500 mt-1">
              Doc ID: {selectedDoc.doc_id || selectedDoc.docId} • Source: {selectedDoc.source}
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedDoc.content || `Full official institutional document record indexed in CampusIQ vector store for instant semantic retrieval.`}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
