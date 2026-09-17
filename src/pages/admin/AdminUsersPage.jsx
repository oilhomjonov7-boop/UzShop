import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import { RoleBadge } from '../../components/auth/RoleBadge';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { showToast } from '../../components/common/Toast';
import {
  Users,
  Search,
  Shield,
  Trash2,
  Check,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Headphones,
  PackageCheck
} from 'lucide-react';

const ROLES = ['Admin', 'Manager', 'CallCenter', 'User'];

export const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch all users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    staleTime: 1000 * 20,
  });

  // Mutation to update user role
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => usersApi.updateRole(id, role),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast.success(
        `Foydalanuvchi roli "${updatedUser.role}" ga muvaffaqiyatli o'zgartirildi!`,
        "Rol yangilandi"
      );
    },
    onError: (err) => {
      showToast.error(err.message || "Rolni o'zgartirishda xatolik yuz berdi");
    }
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast.success("Foydalanuvchi tizimdan o'chirildi");
      setDeleteConfirmId(null);
    },
    onError: (err) => {
      showToast.error(err.message || "Foydalanuvchini o'chirishda xatolik");
    }
  });

  const handleRoleChange = (userId, newRole) => {
    if (userId === currentUser?.id && newRole !== 'Admin') {
      showToast.error("Siz o'zingizning Admin rolingizni pasaytira olmaysiz!");
      return;
    }
    updateRoleMutation.mutate({ id: userId, role: newRole });
  };

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-800 text-xs font-bold mb-2 border border-rose-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Moduli — Foydalanuvchilar va RBAC Huquqlari</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Foydalanuvchilar & Rollar Boshqaruvi</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Foydalanuvchilar ro'yxati va har bir profil uchun huquq darajasini (RBAC Matrix) sozlang.
          </p>
        </div>
      </div>

      {/* Role Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { role: 'Admin', count: users.filter(u => u.role === 'Admin').length, icon: ShieldCheck, color: 'text-rose-600 bg-rose-50' },
          { role: 'Manager', count: users.filter(u => u.role === 'Manager').length, icon: PackageCheck, color: 'text-indigo-600 bg-indigo-50' },
          { role: 'CallCenter', count: users.filter(u => u.role === 'CallCenter').length, icon: Headphones, color: 'text-amber-600 bg-amber-50' },
          { role: 'User', count: users.filter(u => u.role === 'User').length, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.role} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">{item.role}lar soni:</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{item.count} nafar</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-88">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ism, email yoki telefon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/25 focus:border-rose-500 outline-none transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Rol bo'yicha:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Barcha rollar</option>
            {ROLES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : isError ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">Foydalanuvchilarni yuklab bo'lmadi</h3>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-4">Foydalanuvchi</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Telefon</th>
                  <th className="py-4 px-4">Joriy Rol</th>
                  <th className="py-4 px-4">Rolni O'zgartirish (RBAC Switch)</th>
                  <th className="py-4 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredUsers.map(user => {
                  const isCurrent = user.id === currentUser?.id;
                  const isMutating = updateRoleMutation.isPending;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{user.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] text-brand-600 font-bold block">(Siz)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {user.phone || "Kiritilmagan"}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Role Switcher Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            disabled={isMutating}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer disabled:opacity-50 transition"
                          >
                            {ROLES.map(r => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Delete user */}
                      <td className="py-3.5 px-4 text-right">
                        {!isCurrent ? (
                          <button
                            onClick={() => setDeleteConfirmId(user.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Asosiy admin</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteConfirmId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 z-10 animate-slide-up text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Foydalanuvchini o'chirmoqchimisiz?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">Ushbu foydalanuvchining hisobi va ruxsatlari butunlay bekor qilinadi.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 shadow-md"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
