import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../api/client';
import { showToast } from '../../components/common/Toast';
import {
  ShoppingBag,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Headphones,
  UserCheck,
  Sparkles
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'Admin',
    name: 'Super Admin',
    email: 'admin@uzshop.uz',
    password: 'password123',
    icon: ShieldCheck,
    desc: 'Analitika, barcha maʼlumotlar va rollar nazorati',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 hover:border-rose-400'
  },
  {
    role: 'Manager',
    name: 'Jasur Rahimov',
    email: 'manager@uzshop.uz',
    password: 'password123',
    icon: PackageCheck,
    desc: 'Mahsulotlar CRUD, zaxira (stock) va narxlar',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:border-indigo-400'
  },
  {
    role: 'CallCenter',
    name: 'Madina Karimova',
    email: 'operator@uzshop.uz',
    password: 'password123',
    icon: Headphones,
    desc: 'Buyurtmalar oqimi va mijozlar bilan aloqa',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 hover:border-amber-400'
  },
  {
    role: 'User',
    name: 'Ali Valiyev',
    email: 'ali@uzshop.uz',
    password: 'password123',
    icon: UserCheck,
    desc: 'Katalog, savatcha va buyurtma berish',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:border-emerald-400'
  }
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      login(res.user, res.token);
      showToast.success(`Xush kelibsiz, ${res.user.name}!`, "Tizimga muvaffaqiyatli kirildi");

      // Redirect depending on role
      if (from !== '/' && from !== '/login') {
        navigate(from, { replace: true });
      } else if (res.user.role === 'Admin') {
        navigate('/admin');
      } else if (res.user.role === 'Manager') {
        navigate('/manager');
      } else if (res.user.role === 'CallCenter') {
        navigate('/callcenter');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast.error(err.message || "Kirishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handle1ClickDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    
    // Auto-login for best tester UX
    login({
      id: acc.role === 'Admin' ? 1 : acc.role === 'Manager' ? 2 : acc.role === 'CallCenter' ? 3 : 4,
      email: acc.email,
      role: acc.role,
      name: acc.name,
      phone: '+998901234567'
    }, `mock-jwt-token-${acc.role.toLowerCase()}`);

    showToast.success(`${acc.name} (${acc.role}) sifatida tizimga kirildi!`);
    
    if (acc.role === 'Admin') navigate('/admin');
    else if (acc.role === 'Manager') navigate('/manager');
    else if (acc.role === 'CallCenter') navigate('/callcenter');
    else navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">Tizimga Kirish</h2>
              <p className="text-xs text-slate-400">UzShop platformasiga xush kelibsiz</p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email manzil</span>
              </label>
              <input
                type="email"
                required
                placeholder="admin@uzshop.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Parol</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoading ? "Kirilmoqda..." : (
                <>
                  <span>Kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>

        {/* Right 1-Click Demo Accounts Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-black uppercase tracking-wider">Tezkor Sinov Rejimi (1-Click Demo)</h3>
            </div>
            <p className="text-[11px] text-amber-800 mt-1">
              TZ dagi har bir rolni (RBAC) sinovdan o'tkazish uchun quyidagi hisoblardan birini tanlang:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.map(acc => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handle1ClickDemo(acc)}
                  className={`p-4 rounded-2xl border text-left transition transform hover:-translate-y-0.5 shadow-sm bg-white hover:shadow-md flex flex-col justify-between ${acc.badgeClass}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black">{acc.role}</span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{acc.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{acc.email}</p>
                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-tight">{acc.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-bold flex items-center justify-between text-slate-700">
                    <span>1-bosishda kirish</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
