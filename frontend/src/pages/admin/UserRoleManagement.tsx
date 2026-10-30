import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { adminService } from '../../services/api';
import { User } from '../../types';
import { UserCheck, Shield, Search, CheckCircle2 } from 'lucide-react';

export const UserRoleManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers();
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user: User) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    if (!confirm(`Switch ${user.name}'s role to ${newRole}?`)) return;

    try {
      const res = await adminService.updateUserRole(user.id, { role: newRole });
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert('Failed to update role');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin />
      <div className="flex-1 ml-64">
        <Navbar title="User & Role Management" subtitle="Manage role-based access control (RBAC), administrator privileges, and credentials" />

        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">System Users ({users.length})</h3>
              <p className="text-xs text-slate-500">Authorized accounts registered on CampusIQ</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-6">Email Address</th>
                    <th className="py-3.5 px-6">Roll Number / ID</th>
                    <th className="py-3.5 px-6">Department</th>
                    <th className="py-3.5 px-6">Current Role</th>
                    <th className="py-3.5 px-6 text-right">Switch Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                      <td className="py-4 px-6 text-slate-600 font-mono text-xs">{u.email}</td>
                      <td className="py-4 px-6 font-mono text-xs font-semibold">{u.rollNumber || 'STAFF'}</td>
                      <td className="py-4 px-6 text-xs text-slate-500">{u.department || 'CSE'}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role === 'admin' ? 'Administrator' : 'Student'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                        >
                          Change to {u.role === 'admin' ? 'Student' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
