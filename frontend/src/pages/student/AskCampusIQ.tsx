import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { ragService } from '../../services/api';
import { RAGAnswer, RAGSource } from '../../types';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FileCheck2,
  Trash2,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: RAGSource[];
  confidence?: 'High' | 'Medium' | 'Low';
  category?: string;
  suggestedQuestions?: string[];
  timestamp: string;
}

export const AskCampusIQ: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [engineStatus, setEngineStatus] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQueries = [
    "What is the minimum attendance required for semester examinations?",
    "What are the placement eligibility criteria?",
    "When are the upcoming examinations?",
    "Explain the attendance policy.",
    "What is the minimum CGPA required for placements?"
  ];

  useEffect(() => {
    // Check AI Engine Status
    ragService.getStatus().then((res) => {
      if (res.data.success) setEngineStatus(res.data);
    }).catch(() => {});

    // Load initial welcome message
    setMessages([
      {
        id: 'welcome-1',
        sender: 'ai',
        text: "Hello! I am **CampusIQ AI**, your official academic intelligence assistant. I am grounded in 190 institutional records across 10 categories (Regulations, Schedules, Placements, FAQs). Ask me any university question, and I will provide verified answers with exact document citations.",
        confidence: 'High',
        category: 'Institutional Guidance',
        suggestedQuestions: [
          "What is the minimum attendance required for semester examinations?",
          "What are the placement eligibility criteria for Tier-1 companies?",
          "When are the upcoming semester examinations?"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await ragService.ask(textToSend.trim());
      const data: RAGAnswer = res.data;

      const aiMsg: ChatMessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer,
        sources: data.sources,
        confidence: data.confidence,
        category: data.category,
        suggestedQuestions: data.suggested_questions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I encountered an error connecting to the retrieval service. Please check your network or try again.",
          confidence: 'Low',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    ragService.clearHistory().catch(() => {});
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: "Chat cleared. What institutional question can I help you with today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-full">
        <Navbar title="Ask CampusIQ – AI Academic Assistant" subtitle="RAG-Powered Institutional Search & Question Answering" />

        <div className="flex-1 mt-16 flex flex-col h-[calc(100vh-4rem)] p-6 max-w-5xl mx-auto w-full overflow-hidden">
          {/* Engine Status Banner */}
          <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 mb-4 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-800">CampusIQ RAG Engine: Active</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">190 Indexed Documents across 10 Categories</span>
              <span className="text-slate-400">•</span>
              <span className="text-blue-600 font-medium">Provider: {engineStatus?.llm_provider || 'Synthesized RAG Fallback'}</span>
            </div>
            <button
              onClick={handleClearHistory}
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Chat Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 mt-1">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div className={`max-w-3xl rounded-2xl p-5 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-md rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'
                }`}>
                  {/* Category and Confidence Pill */}
                  {msg.sender === 'ai' && msg.category && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 text-xs">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {msg.category}
                      </span>
                      {msg.confidence && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                          msg.confidence === 'High' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Confidence: {msg.confidence}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="text-sm leading-relaxed whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>

                  {/* Grounded Source Citations (MODULE 1 Core Requirement) */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                          <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                          <span>Verified Institutional Sources ({msg.sources.length})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Grounded RAG Retrieval</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {msg.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs hover:border-blue-300 transition"
                          >
                            <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                              <span className="truncate pr-2">{src.title}</span>
                              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1 rounded shrink-0">
                                {Math.round(src.relevance_score * 100)}% Match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                              "{src.snippet}"
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1 border-t border-slate-200/50">
                              <span>Ref: {src.doc_id}</span>
                              <span>File: {src.source}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Suggested Follow-ups:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSend(q)}
                            className="text-xs font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-lg border border-slate-200 text-left transition cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] mt-2 text-right ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3.5 items-start">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="h-5 w-5 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-3 text-slate-600 text-sm">
                  <div className="flex space-x-1.5">
                    <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce delay-150"></span>
                    <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce delay-300"></span>
                  </div>
                  <span className="text-xs text-slate-500">Searching knowledge base and formulating grounded answer...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Clickable Sample Queries Carousel */}
          <div className="mt-3 pt-2">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs text-slate-500 no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Try Asking:
              </span>
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sq)}
                  disabled={isLoading}
                  className="shrink-0 px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full border border-slate-200 text-xs font-medium transition cursor-pointer shadow-2xs"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* Query Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mt-2 relative flex items-center"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask CampusIQ about attendance, exams, placements, faculty, hostel, or regulations..."
              disabled={isLoading}
              className="w-full bg-white border border-slate-300 rounded-xl py-3.5 pl-4 pr-24 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg font-semibold text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
            >
              <span>Ask</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
