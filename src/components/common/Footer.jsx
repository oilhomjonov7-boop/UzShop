import React from 'react';
import { ShoppingBag, Phone, Mail, MapPin, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../utils/useTranslation';

export const Footer = () => {
  const { t, getCategoryName } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800 text-sm">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50">
            <Truck className="w-8 h-8 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">{t('catalog.trustPillars.oneDayTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('catalog.trustPillars.oneDayDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50">
            <ShieldCheck className="w-8 h-8 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">{t('catalog.trustPillars.originalTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('catalog.trustPillars.originalDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50">
            <Headphones className="w-8 h-8 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">{t('footer.supportTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('footer.supportDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50">
            <RotateCcw className="w-8 h-8 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">{t('catalog.trustPillars.returnsTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('catalog.trustPillars.returnsDesc')}</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/uzshop-emblem.png"
                alt="UzShop"
                className="w-11 h-11 rounded-2xl object-cover shadow-lg shadow-emerald-950/40 ring-1 ring-white/10"
              />
              <div>
                <span className="text-2xl font-black tracking-tight text-white">UZ<span className="text-brand-400">SHOP</span></span>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{t('footer.tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footer.aboutText')}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">Payme</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">Click</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">Uzum</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">Naqd</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3 text-sm">
            <h5 className="font-bold text-white tracking-wider uppercase text-xs">{t('footer.catalogTitle')}</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/?category=cat-1" className="hover:text-white transition">{getCategoryName('cat-1')}</Link></li>
              <li><Link to="/?category=cat-6" className="hover:text-white transition">{getCategoryName('cat-6')}</Link></li>
              <li><Link to="/?category=cat-7" className="hover:text-white transition">{getCategoryName('cat-7')}</Link></li>
              <li><Link to="/?category=cat-8" className="hover:text-white transition">{getCategoryName('cat-8')}</Link></li>
              <li><Link to="/?category=cat-9" className="hover:text-white transition">{getCategoryName('cat-9')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 text-sm">
            <h5 className="font-bold text-white tracking-wider uppercase text-xs">{t('footer.rolesTitle')}</h5>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-emerald-400 font-medium">User:</span> Katalog, savatcha, buyurtma berish</li>
              <li><span className="text-amber-400 font-medium">CallCenter:</span> Buyurtmalar statusi va mijoz aloqasi</li>
              <li><span className="text-indigo-400 font-medium">Manager:</span> Mahsulotlar CRUD, zaxira va narxlar</li>
              <li><span className="text-rose-400 font-medium">Admin:</span> Tizim tushumi, analitika va rollar</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 text-sm">
            <h5 className="font-bold text-white tracking-wider uppercase text-xs">{t('footer.contactTitle')}</h5>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+998 (71) 200-00-00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>info@uzshop.uz</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>{t('footer.address')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} UzShop. {t('footer.rights')}</p>
          <p className="flex items-center gap-2">
            <span>React + Vite</span> •
            <span>Tailwind CSS</span> •
            <span>Zustand</span> •
            <span>TanStack Query</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
