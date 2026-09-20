import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { authApi } from '../../api/client';
import { showToast } from '../../components/common/Toast';
import { ShoppingBag, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+998',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast.error("Parollar mos kelmadi!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      login(res.user, res.token);
      showToast.success(`Xush kelibsiz, ${res.user.name}! Hisobingiz yaratildi.`);
      
      const cartItems = useCartStore.getState().items;
      if (cartItems.length > 0) {
        useCartStore.getState().setIsCartOpen(true);
      }
      navigate(from !== '/login' && from !== '/register' ? from : '/', { replace: true });
    } catch (err) {
      showToast.error(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">Ro'yxatdan O'tish</h2>
            <p className="text-xs text-slate-400">Yangi xaridor hisobini yarating</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Ism va Familiya *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: Sardor Rustamov"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email manzil *</span>
            </label>
            <input
              type="email"
              required
              placeholder="sardor@example.uz"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Telefon raqami *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+998 90 123 45 67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Parol *</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Kamida 6 ta belgi"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Parolni tasdiqlang *</span>
            </label>
            <input
              type="password"
              required
              placeholder="Parolni qayta kiriting"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? "Yaratilmoqda..." : (
              <>
                <span>Ro'yxatdan o'tish</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Allaqachon hisobingiz bormi?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Kirish
          </Link>
        </div>
      </div>
    </div>
  );
};
