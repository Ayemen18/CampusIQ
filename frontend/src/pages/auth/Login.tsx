import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message || 'Invalid email or password');
    }
  };

  const handleDemoFill = (type: 'student1' | 'student2' | 'admin') => {
    setError('');
    if (type === 'student1') {
      setEmail('student@campusiq.edu');
      setPassword('student123');
    } else if (type === 'student2') {
      setEmail('krishna@campusiq.edu');
      setPassword('student123');
    } else {
      setEmail('admin@campusiq.edu');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-4">
          <GraduationCap className="h-9 w-9" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          CampusIQ
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          AI-Powered University Student Support & Academic Intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
              1-Click Presentation Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('student1')}
                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 text-center transition-all flex flex-col items-center justify-center"
              >
                <span>Student 1</span>
                <span className="text-[10px] text-blue-500 font-normal">Ayemen</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('student2')}
                className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 text-center transition-all flex flex-col items-center justify-center"
              >
                <span>Student 2</span>
                <span className="text-[10px] text-indigo-500 font-normal">Krishna</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg text-center transition-all flex flex-col items-center justify-center shadow-sm"
              >
                <span>Admin</span>
                <span className="text-[10px] text-slate-300 font-normal">Dean Portal</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campusiq.edu"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
