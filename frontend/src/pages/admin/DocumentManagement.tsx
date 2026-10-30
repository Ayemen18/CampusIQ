import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { documentService } from '../../services/api';
import { DocumentItem } from '../../types';
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Plus
} from 'lucide-react';

export const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docCategory, setDocCategory] = useState('Academic Document');
  const [docTitle, setDocTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getAll(undefined, search);
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
  }, [search]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadSuccess('');
    setUploadError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', docTitle || selectedFile.name);
    formData.append('category', docCategory);

    try {
      const res = await documentService.upload(formData);
      if (res.data.success) {
        setUploadSuccess(`Document "${selectedFile.name}" successfully indexed into RAG vector knowledge base!`);
        setSelectedFile(null);
        setDocTitle('');
        fetchDocs();
      }
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the knowledge base?`)) return;
    try {
      await documentService.delete(id);
      fetchDocs();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <div className="flex-1 ml-64">
        <Navbar title="Knowledge Base & Document Management" subtitle="Ingest academic circulars, syllabus PDFs, and institutional regulations into vector store" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Document Ingestion Card (Module 1 Core Upload Requirement) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-blue-600" />
              <span>Ingest New Institutional Document into Vector DB</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Supports academic PDFs, policy text files, and regulations. Automatically extracts text, performs chunking, generates embeddings, and updates the RAG engine.
            </p>

            {uploadSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select File (PDF / TXT)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.txt,.json,.md"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      if (!docTitle) setDocTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Revised Exam Guidelines 2026"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Attendance Policy">Attendance Policy</option>
                  <option value="Placement Guidelines">Placement Guidelines</option>
                  <option value="Examination Schedule">Examination Schedule</option>
                  <option value="Academic Calendar">Academic Calendar</option>
                  <option value="Academic Document">Academic Document</option>
                  <option value="Circular">Official Circular</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isUploading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Ingest into RAG</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Knowledge Base Index ({documents.length} Records)</h3>
                <p className="text-xs text-slate-500">Live indexed documents serving CampusIQ AI semantic retrieval</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
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
                    <th className="py-3.5 px-6">Document ID</th>
                    <th className="py-3.5 px-6">Title</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Source File</th>
                    <th className="py-3.5 px-6">Chunks</th>
                    <th className="py-3.5 px-6">Size</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10">
                        <div className="h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : documents.slice(0, 30).map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-800">{doc.docId}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-900 max-w-xs truncate">{doc.title}</td>
                      <td className="py-3.5 px-6">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-500">{doc.source}</td>
                      <td className="py-3.5 px-6 text-xs font-semibold text-slate-700">{doc.chunksCount}</td>
                      <td className="py-3.5 px-6 text-xs text-slate-500">{doc.fileSize}</td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => handleDelete(doc._id, doc.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition cursor-pointer"
                          title="Remove from knowledge base"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {documents.length > 30 && (
              <div className="p-3 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-100">
                Displaying first 30 of {documents.length} knowledge base records. Use search filter above for specific lookups.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
