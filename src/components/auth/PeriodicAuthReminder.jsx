import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from '../../utils/useTranslation';
import { LogIn, UserPlus, X, Bell, Sparkles } from 'lucide-react';

const REMINDER_INTERVAL_MS = 30 * 1000; // Har 30 soniyada
const AUTO_DISMISS_SECONDS = 10; // 10 soniyadan so'ng avtomatik yopilish

export const PeriodicAuthReminder = () => {
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(AUTO_DISMISS_SECONDS);
  const dismissTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Har 1 minutda tekshiruvchi timer
  useEffect(() => {
    // Agar foydalanuvchi tizimga kirgan bo'lsa, timer ishlamaydi
    if (isAuthenticated) {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      // Login yoki Register sahifasida bo'lsa eslatma chiqarmaymiz
      const isAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register';

      if (!isAuthenticated && !isAuthPage) {
        setIsVisible(true);
        setTimeLeft(AUTO_DISMISS_SECONDS);
      }
    }, REMINDER_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Eslatma chiqqanida avtomatik 15 soniya countdown
  useEffect(() => {
    if (isVisible) {
      // Avtomatik yopish taymeri
      dismissTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, AUTO_DISMISS_SECONDS * 1000);

      // Har soniyada progress hisoblagich
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }

    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isVisible]);

  // Sahifa login yoki register ga o'tganda eslatmani yashirish
  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register') {
      setIsVisible(false);
    }
  }, [location.pathname]);

  if (!isVisible || isAuthenticated) {
    return null;
  }

  const handleGoLogin = () => {
    setIsVisible(false);
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleGoRegister = () => {
    setIsVisible(false);
    navigate('/register', { state: { from: location.pathname } });
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const progressPercent = (timeLeft / AUTO_DISMISS_SECONDS) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none pointer-events-auto animate-fade-in">
      {/* Dimmed backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Centered Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-slate-900/10 transition-all duration-300 transform scale-100 animate-slide-up">
        {/* Top Progress bar */}
        <div className="h-1.5 w-full bg-emerald-100/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-6 sm:p-7 text-center relative">
          {/* Top Close X */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            title={t('auth.reminderLater')}
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Centered Animated Icon & Badge */}
          <div className="relative inline-flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <Bell className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
              {t('auth.reminderBadge')}
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
            {t('auth.reminderTitle')}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-sm mx-auto">
            {t('auth.reminderDesc')}
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-2.5">
            <button
              onClick={handleGoLogin}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('auth.loginBtn')}</span>
            </button>

            <button
              onClick={handleGoRegister}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 active:scale-95 text-sm font-bold rounded-xl border border-slate-200 hover:border-emerald-200 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('auth.registerBtn')}</span>
            </button>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleClose}
            className="mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600 hover:underline transition cursor-pointer py-1"
          >
            {t('auth.reminderLater')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodicAuthReminder;
