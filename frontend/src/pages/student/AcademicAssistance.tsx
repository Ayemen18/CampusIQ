import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import {
  BookOpen,
  Award,
  Users,
  FileText,
  Calculator,
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AcademicAssistance: React.FC = () => {
  const navigate = useNavigate();

  const guidelines = [
    {
      title: 'Major Project Stage-1 (CS706PW)',
      guide: 'Mrs. Arshiya Begum (Assistant Professor, Dept of CSE-Data Science)',
      timeline: 'Review Date: Dec 07 - Dec 10, 2026',
      deliverables: 'Problem Statement, Literature Survey, System Architecture, RAG Pipeline Prototype, and Design Review slides.'
    },
    {
      title: '10-Point Academic Grading & SGPA Formula',
      guide: 'Controller of Examinations',
      timeline: 'Autonomous Academic Regulations 2026',
      deliverables: 'O (10: 90%+), A+ (9: 80-89%), A (8: 70-79%), B+ (7: 60-69%), B (6: 50-59%), C (5: 40-49%), F (0: <40%). SGPA = Sum(Credit * GradePoint) / Sum(Credits).'
    },
    {
      title: 'MOOCs & NPTEL Honours / Minor Degree Credits',
      guide: 'Dean of Academic Affairs',
      timeline: 'Registration Deadline: Nov 20, 2026',
      deliverables: 'Earn 18 additional credits across Semesters 4 to 7 with CGPA >= 7.5 to graduate with B.Tech Honours.'
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Academic Assistance & Regulations" subtitle="Institutional curriculum guidelines, project mentoring, and grading formulas" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Quick AI Trigger Card */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">AI Assistant Assistance</span>
              <h2 className="text-xl font-bold mt-1">Have questions about syllabus, faculty or policies?</h2>
              <p className="text-xs text-slate-300 mt-0.5">CampusIQ answers any academic regulation query with verified citations.</p>
            </div>
            <button
              onClick={() => navigate('/ask')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Ask CampusIQ</span>
            </button>
          </div>

          {/* Academic Modules Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guidelines.map((g, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit mb-4">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{g.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Authority: {g.guide}</p>
                  <p className="text-xs font-mono text-blue-600 font-semibold mt-1">{g.timeline}</p>
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    {g.deliverables}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Team Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-2">Major Project Details: CampusIQ (Batch A20)</h3>
            <p className="text-xs text-slate-500 mb-4">Department of Computer Science & Engineering - Data Science, MLRIT</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-400 font-semibold uppercase">Lead Presenter</p>
                <p className="font-bold text-slate-900 mt-1">Shaik Abdul Kareem Ayemen</p>
                <p className="text-xs font-mono text-slate-500">23R21A6754</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-400 font-semibold uppercase">Team Member</p>
                <p className="font-bold text-slate-900 mt-1">Sai Krishna</p>
                <p className="text-xs font-mono text-slate-500">23R21A6704</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-400 font-semibold uppercase">Team Member</p>
                <p className="font-bold text-slate-900 mt-1">Shaik Sameer Basha</p>
                <p className="text-xs font-mono text-slate-500">23R21A6755</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
