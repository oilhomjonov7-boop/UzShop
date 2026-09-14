import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { RoleBadge } from './RoleBadge';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-rose-600">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Kirish Cheklangan (403)</h2>
          <p className="text-sm text-slate-500 mb-6">
            Ushbu sahifaga faqat quyidagi rollar kirishi mumkin:
            <span className="font-semibold text-slate-700 block mt-1">
              {allowedRoles.join(', ')}
            </span>
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Sizning joriy rolingiz:</span>
            <RoleBadge role={user.role} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition"
            >
              <Home className="w-4 h-4" /> Bosh sahifaga
            </Link>
            {user.role === 'Admin' && (
              <Link
                to="/admin"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition"
              >
                Admin Panel
              </Link>
            )}
            {user.role === 'Manager' && (
              <Link
                to="/manager"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition"
              >
                Menejer Panel
              </Link>
            )}
            {user.role === 'CallCenter' && (
              <Link
                to="/callcenter"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-medium text-sm hover:bg-amber-700 transition"
              >
                Operator Panel
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
};
