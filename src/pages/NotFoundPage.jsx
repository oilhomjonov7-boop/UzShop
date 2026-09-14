import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <span className="text-6xl font-black text-brand-600 block mb-2">404</span>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Sahifa Topilmadi</h2>
        <p className="text-xs text-slate-500 mb-6">
          Siz qidirayotgan sahifa o'chirilgan yoki manzili o'zgargan bo'lishi mumkin.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
        >
          <Home className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>
    </div>
  );
};
