import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../utils/useTranslation';
import { useCartStore } from '../../store/useCartStore';
import {
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  Truck,
  Clock,
  CreditCard,
  ShoppingBag
} from 'lucide-react';

export const AuthRequiredModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsCartOpen } = useCartStore();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    setIsCartOpen(false);
    if (onClose) onClose();
    navigate(path, { state: { from: location.pathname } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-slide-up">
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShoppingBag className="w-8 h-8 text-white animate-pulse" />
          </div>

          <h3 className="text-xl font-black text-white leading-snug">
            {t('auth.authRequiredTitle')}
          </h3>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto leading-relaxed">
            {t('auth.authRequiredDesc')}
          </p>
        </div>

        {/* Benefits list */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Truck className="w-3 h-3" />
              </div>
              <span>{t('auth.benefit1')}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Clock className="w-3 h-3" />
              </div>
              <span>{t('auth.benefit2')}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-3 h-3" />
              </div>
              <span>{t('auth.benefit3')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => handleNavigate('/login')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('auth.loginBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/register')}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>{t('auth.registerBtn')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              {t('auth.continueBrowsing')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
