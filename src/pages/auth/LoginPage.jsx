import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { authApi } from '../../api/client';
import { showToast } from '../../components/common/Toast';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'Admin',
    name: 'Odiljon Ilhomjonov',
    email: 'oilhomjonov7@gmail.com',
    password: 'odiljon',
    icon: ShieldCheck,
    desc: 'Boshqaruvchi: Analitika, barcha maʼlumotlar va rollar nazorati',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 hover:border-rose-400'
  }
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.state?.from || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      login(res.user, res.token);
      showToast.success(`Xush kelibsiz, ${res.user.name}!`, "Tizimga muvaffaqiyatli kirildi");

      // Re-open cart if user has pending items to purchase
      const cartItems = useCartStore.getState().items;
      if (cartItems.length > 0 && res.user.role === 'User') {
        useCartStore.getState().setIsCartOpen(true);
      }

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
    
    login({
      id: '1',
      email: acc.email,
      role: 'Admin',
      name: acc.name,
      phone: '+998991370023'
    }, 'mock-jwt-token-admin');

    showToast.success(`${acc.name} (${acc.role}) sifatida tizimga kirildi!`);
    navigate('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Form */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/uzshop-emblem.png"
              alt="UzShop Logo"
              className="w-11 h-11 rounded-2xl object-cover shadow-md shadow-emerald-950/10 ring-1 ring-slate-200/80 dark:ring-slate-700"
            />
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Tizimga Kirish</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">UzShop platformasiga xush kelibsiz</p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Email manzil</span>
              </label>
              <input
                type="email"
                required
                placeholder="oilhomjonov7@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Parol</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Kirilmoqda..." : (
                <>
                  <span>Kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>

        {/* Right 1-Click Admin Account */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-950 dark:text-rose-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-900 dark:text-rose-300">
                Administrator Tezkor Kirish (1-Click)
              </h3>
            </div>
            <p className="text-xs text-rose-800 dark:text-rose-300/80 mt-1 leading-relaxed">
              Boshqaruvchi hisobi bilan 1-bosishda to'g'ridan-to'g'ri tizimga kiring:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {DEMO_ACCOUNTS.map(acc => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handle1ClickDemo(acc)}
                  className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 hover:border-rose-400 dark:hover:border-rose-700 bg-white dark:bg-slate-900 hover:bg-rose-50/40 dark:hover:bg-slate-800 text-left transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                        {acc.role} (Boshqaruvchi)
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/60 transition">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{acc.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{acc.email}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">{acc.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold flex items-center justify-between text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300">
                    <span>1-bosishda kirish</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
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
