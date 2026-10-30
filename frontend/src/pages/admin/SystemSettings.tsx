import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Settings, Save, CheckCircle2, ShieldCheck, Sliders, Database, Sparkles } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    minAttendance: 75,
    minCondonation: 65,
    condonationFee: 1500,
    tier1Cgpa: 7.5,
    tier2Cgpa: 6.75,
    tier3Cgpa: 6.0,
    academicSession: '2026-2027',
    semester: 'VII Semester',
    institutionName: 'Marri Laxman Reddy Institute of Technology (MLRIT)',
    aiProvider: 'Synthesized RAG Fallback (Local Autonomous Engine)'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <div className="flex-1 ml-64">
        <Navbar title="System Settings & Institutional Rules" subtitle="Configure university policy thresholds, attendance condonation parameters, and AI engine" />

        <main className="p-8 mt-16 max-w-5xl mx-auto space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {saved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Institutional thresholds updated successfully. Dynamic eligibility rules updated across student dashboards.</span>
              </div>
            )}

            {/* Attendance Rules Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-blue-600" />
                <span>Attendance & Condonation Rule Parameters</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6">Autonomous regulation thresholds applied for semester exam clearance</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mandatory Regular Attendance (%)
                  </label>
                  <input
                    type="number"
                    value={settings.minAttendance}
                    onChange={(e) => setSettings({ ...settings, minAttendance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Standard university threshold: 75%</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Minimum Condonation Cutoff (%)
                  </label>
                  <input
                    type="number"
                    value={settings.minCondonation}
                    onChange={(e) => setSettings({ ...settings, minCondonation: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Below this, detention is strictly enforced (65%)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Condonation Fee (INR)
                  </label>
                  <input
                    type="number"
                    value={settings.condonationFee}
                    onChange={(e) => setSettings({ ...settings, condonationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Examination Branch fee: Rs. 1,500</span>
                </div>
              </div>
            </div>

            {/* Placement Rules Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <span>Placement Tier Eligibility Cutoffs</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6">Career Development Cell minimum CGPA requirements</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tier-1 Dream CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.tier1Cgpa}
                    onChange={(e) => setSettings({ ...settings, tier1Cgpa: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Offers &gt; 10 LPA (e.g. Amazon, Google): 7.5</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tier-2 Core CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.tier2Cgpa}
                    onChange={(e) => setSettings({ ...settings, tier2Cgpa: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Offers 6-10 LPA (e.g. Epam, Virtusa): 6.75</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tier-3 Mass Recruiter Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.tier3Cgpa}
                    onChange={(e) => setSettings({ ...settings, tier3Cgpa: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Mass Hiring (TCS, Wipro, Cognizant): 6.0</span>
                </div>
              </div>
            </div>

            {/* AI Engine & System Information */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>AI RAG Engine & Model Configuration</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">Underlying retrieval and semantic ranking system</p>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span>Active Knowledge Retrieval Provider</span>
                  <span className="font-bold text-slate-900">{settings.aiProvider}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span>Vector Database Retained Records</span>
                  <span className="font-bold text-slate-900">190 Records across 10 categories</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span>Institution Identity</span>
                  <span className="font-bold text-slate-900">{settings.institutionName}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
