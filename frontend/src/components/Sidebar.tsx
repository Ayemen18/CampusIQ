import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Bot,
  Search,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Briefcase,
  Bell,
  HelpCircle,
  User,
  ShieldCheck,
  FileText,
  Users,
  UserCheck,
  AlertCircle,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: any;
  isAi?: boolean;
}

interface SidebarProps {
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/ask', label: 'Ask CampusIQ', icon: Bot, isAi: true },
    { to: '/documents', label: 'Document Search', icon: Search },
    { to: '/academic-assistance', label: 'Academic Assistance', icon: BookOpen },
    { to: '/attendance', label: 'Attendance & Academics', icon: CalendarCheck },
    { to: '/exams', label: 'Exam Schedules', icon: CalendarDays },
    { to: '/placements', label: 'Placements', icon: Briefcase },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/grievances', label: 'Grievances', icon: HelpCircle },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  const adminLinks: NavItem[] = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/documents', label: 'Document Management', icon: FileText },
    { to: '/admin/students', label: 'Student Management', icon: Users },
    { to: '/admin/users', label: 'User & Roles', icon: UserCheck },
    { to: '/admin/grievances', label: 'Grievance Management', icon: AlertCircle },
    { to: '/admin/notices', label: 'Academic Notices', icon: Bell },
    { to: '/admin/analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800 shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              CampusIQ
              <span className="text-[10px] uppercase font-bold bg-blue-600/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
                {isAdmin ? 'Admin' : 'AI'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Academic Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher Pill if Admin */}
      {user?.role === 'admin' && (
        <div className="px-4 pt-3 pb-1">
          <div className="bg-slate-800/80 p-1 rounded-lg flex text-xs font-semibold border border-slate-700/60">
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex-1 py-1.5 rounded-md transition-all text-center ${
                !isAdmin ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student View
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className={`flex-1 py-1.5 rounded-md transition-all text-center ${
                isAdmin ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider px-3 mb-2">
          {isAdmin ? 'Administration' : 'Student Portal'}
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{link.label}</span>
              </div>
              {link.isAi && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 text-slate-900 shadow-sm animate-pulse">
                  RAG
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/40">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.role === 'admin' ? 'Administrator' : user?.rollNumber || 'Student'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
