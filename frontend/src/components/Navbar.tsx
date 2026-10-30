import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Sparkles, Shield, User, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8 shadow-sm">
      {/* Title & Context */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>

      {/* Right Action Items */}
      <div className="flex items-center space-x-4">
        {/* Academic Session Pill */}
        <div className="hidden md:flex items-center space-x-2 bg-blue-50/80 border border-blue-200/60 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
          <span>MLRIT Autonomous • A.Y. 2026-27</span>
        </div>

        {/* Quick Ask AI shortcut */}
        <button
          onClick={() => navigate('/ask')}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ask CampusIQ AI</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile Mini Pill */}
        <div
          onClick={() => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/profile')}
          className="flex items-center space-x-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
