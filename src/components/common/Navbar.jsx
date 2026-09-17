import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useLanguageStore, LANGUAGES } from '../../store/useLanguageStore';
import { LanguageSelector, FlagIcon } from './LanguageSelector';
import { useTranslation } from '../../utils/useTranslation';
import { productsApi, categoriesApi } from '../../api/client';
import { filterProductsMultilingual } from '../../utils/multilingualSearch';
import { handleImageError } from '../../utils/imageFallback';
import { RoleBadge } from '../auth/RoleBadge';
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Boxes,
  Headphones,
  Package,
  Users,
  Menu,
  X,
  ChevronDown,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LayoutGrid,
  Flame,
  Heart,
  MapPin,
  CreditCard,
  Truck
} from 'lucide-react';

const CATEGORY_ICONS_MAP = {
  'cat-1': '📱', // Smartfonlar
  'cat-2': '💻', // Noutbuklar
  'cat-3': '⌚', // Smart soatlar
  'cat-4': '🎧', // Quloqchinlar
  'cat-5': '🔌', // Aksessuarlar
  'cat-6': '👕', // Kiyim va Poyabzal
  'cat-7': '🏠', // Uy va Oshxona
  'cat-8': '🏋️', // Sport va Fitnes
  'cat-9': '📚', // Kitoblar
  'cat-10': '💄', // Go'zallik & Parvarish
  'cat-11': '☕', // Qahva va Oziq-ovqat
  'cat-12': '🚗', // Avtotovarlar
  'cat-13': '🧸'  // Bolalar Dunyosi
};

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalCount, setIsCartOpen } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const { t, getCategoryName, localizedCities, getLocalizedCityName } = useTranslation();
  const wishlistCount = wishlistIds?.length || 0;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isControlMenuOpen, setIsControlMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Search & Location state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('uzshop_city') || 'Toshkent';
  });
  const [isCityOpen, setIsCityOpen] = useState(false);

  const menuRef = useRef(null);
  const controlMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const cityRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getTotalCount();

  // Fetch all products and categories for lightning-fast multilingual header search
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
    staleTime: 1000 * 60 * 3
  });

  const { data: allCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 5
  });

  // Multilingual live search results preview (UZ Latin / UZ Cyrillic / RU / EN)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return filterProductsMultilingual(allProducts, searchQuery, allCategories).slice(0, 5);
  }, [allProducts, allCategories, searchQuery]);

  // Scroll detection for dynamic elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus and search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (controlMenuRef.current && !controlMenuRef.current.contains(event.target)) {
        setIsControlMenuOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setIsCityOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        (!mobileSearchRef.current || !mobileSearchRef.current.contains(event.target))
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync search input with URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearchQuery(searchParam);
  }, [location.search]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const handleExecuteSearch = (targetQuery = searchQuery) => {
    setIsSearchOpen(false);
    setIsMobileSearchVisible(false);
    setIsMobileMenuOpen(false);
    const queryStr = typeof targetQuery === 'string' ? targetQuery.trim() : (searchQuery || '').trim();
    if (queryStr) {
      navigate(`/products?search=${encodeURIComponent(queryStr)}`);
    } else {
      navigate('/products');
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    handleExecuteSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    if (location.pathname === '/products') {
      const params = new URLSearchParams(location.search);
      params.delete('search');
      const searchStr = params.toString();
      navigate(searchStr ? `/products?${searchStr}` : '/products');
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecuteSearch();
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      {/* TIER 1 (Yuqori Qavat) - Logo, Katalog Tugmasi, Katta Qidiruv, Foydalanuvchi va Savat */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 py-2.5 sm:py-3.5">
          {/* Left: Brand Logo & Uzum-Style Katalog Button */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <Link
              to="/"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            >
              <div className="relative">
                <img
                  src="/uzshop-emblem.png"
                  alt="UZSHOP"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-md shadow-emerald-950/10 ring-1 ring-slate-200/80 group-hover:scale-105 transition-all duration-300"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                    UZ<span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">SHOP</span>
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider uppercase hidden sm:block mt-0.5">
                  {t('common.officialMarket', 'Rasmiy Market')}
                </span>
              </div>
            </Link>

          </div>

          {/* Middle: Shahar tanlovi va Bozorning Eng Muhim Xizmatlari */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0 mx-auto">
            {/* Shahar (Hudud) Tanlash */}
            <div className="relative shrink-0" ref={cityRef}>
              <button
                type="button"
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-white text-xs font-semibold text-slate-700 transition-all cursor-pointer hover:border-slate-300 shadow-2xs whitespace-nowrap shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900 shrink-0">{getLocalizedCityName(selectedCity)}</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                  {t('common.in1Day', '1 kunda')}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-fade-in">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>{t('nav.cityTitle', 'Yetkazib berish shahri')}</span>
                    <span className="text-emerald-600 font-semibold">{t('common.free', 'Bepul')}</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {localizedCities.map(city => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city.rawName);
                          localStorage.setItem('uzshop_city', city.rawName);
                          setIsCityOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition text-left cursor-pointer ${
                          selectedCity === city.rawName
                            ? 'bg-emerald-50 text-emerald-800 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="whitespace-nowrap">{city.name}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{city.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tezkor Bo'lim Havolalari */}
            <div className="flex items-center gap-2 xl:gap-2.5 text-xs font-semibold text-slate-600 shrink-0">
              <Link
                to="/products?discount=true"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/70 font-bold whitespace-nowrap shrink-0 transition-all shadow-2xs"
              >
                <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0 animate-pulse" />
                <span className="whitespace-nowrap">{t('nav.discounts', 'Chegirmalar')}</span>
              </Link>

              <Link
                to="/products?sort=popular"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-50/80 hover:bg-white border border-slate-200/90 font-bold whitespace-nowrap shrink-0 transition-all hover:border-slate-300 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="whitespace-nowrap">{t('nav.popular', 'Ommabop')}</span>
              </Link>

              <Link
                to="/products"
                className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-50/80 hover:bg-white border border-slate-200/90 font-bold whitespace-nowrap shrink-0 transition-all hover:border-slate-300 shadow-2xs"
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="whitespace-nowrap">{t('nav.installment', '0-0-12 Nasiya')}</span>
              </Link>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* If Buyer: Buyurtmalarim link */}
            {isAuthenticated && user.role === 'User' && (
              <Link
                to="/my-orders"
                className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/my-orders')
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Package className="w-4 h-4 text-emerald-600" />
                <span>{t('nav.myOrders', 'Buyurtmalarim')}</span>
              </Link>
            )}

            {/* If Staff / Admin: Boshqaruv Dropdown */}
            {isAuthenticated && (user.role === 'Admin' || user.role === 'Manager' || user.role === 'CallCenter') && (
              <div className="relative" ref={controlMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsControlMenuOpen(!isControlMenuOpen)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    ['/callcenter', '/manager', '/admin', '/admin/users'].some(p => isActive(p))
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">{t('nav.control', 'Boshqaruv')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isControlMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isControlMenuOpen && (
                  <div className="absolute top-full right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] border border-slate-200/80 p-2 z-50 animate-fade-in space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      {t('nav.staffSection', "Xodimlar boshqaruv bo'limi")}
                    </div>
                    {(user.role === 'CallCenter' || user.role === 'Admin') && (
                      <Link
                        to="/callcenter"
                        onClick={() => setIsControlMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                          isActive('/callcenter')
                            ? 'bg-amber-50 text-amber-900'
                            : 'text-slate-700 hover:text-amber-900 hover:bg-amber-50/70'
                        }`}
                      >
                        <Headphones className="w-4 h-4 text-amber-500" />
                        <span>{t('nav.callcenter', 'Operator (CallCenter)')}</span>
                      </Link>
                    )}
                    {(user.role === 'Manager' || user.role === 'Admin') && (
                      <Link
                        to="/manager"
                        onClick={() => setIsControlMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                          isActive('/manager')
                            ? 'bg-indigo-50 text-indigo-900'
                            : 'text-slate-700 hover:text-indigo-900 hover:bg-indigo-50/70'
                        }`}
                      >
                        <Boxes className="w-4 h-4 text-indigo-500" />
                        <span>{t('nav.warehouse', 'Ombor Boshqaruvi')}</span>
                      </Link>
                    )}
                    {user.role === 'Admin' && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setIsControlMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            isActive('/admin')
                              ? 'bg-rose-50 text-rose-900'
                              : 'text-slate-700 hover:text-rose-900 hover:bg-rose-50/70'
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4 text-rose-500" />
                          <span>{t('nav.analytics', 'Analitika & KPI')}</span>
                        </Link>
                        <Link
                          to="/admin/users"
                          onClick={() => setIsControlMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            isActive('/admin/users')
                              ? 'bg-rose-50 text-rose-900'
                              : 'text-slate-700 hover:text-rose-900 hover:bg-rose-50/70'
                          }`}
                        >
                          <Users className="w-4 h-4 text-rose-500" />
                          <span>{t('nav.usersRoles', 'Foydalanuvchilar & Rollar')}</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown or Auth CTA Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1 sm:pr-3 sm:pl-1 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all duration-200 active:scale-95 group focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white font-black text-xs flex items-center justify-center">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>

                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {user.role}
                    </p>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180 text-slate-800' : ''
                    }`}
                  />
                </button>

                {/* Floating Luxury Glass Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] border border-slate-200/80 p-2 z-50 animate-fade-in">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 rounded-xl p-3 border border-slate-200/60 mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-white font-black text-sm flex items-center justify-center shadow-sm">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate font-mono">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">{t('nav.userRole', 'Tizim roli')}:</span>
                        <RoleBadge role={user.role} size="sm" />
                      </div>
                    </div>

                    {/* Quick Navigation Items */}
                    <div className="py-1 space-y-0.5">
                      {user.role === 'User' && (
                        <Link
                          to="/my-orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <Package className="w-4 h-4 text-emerald-600" />
                          <span>{t('nav.historyOrders', 'Buyurtmalarim tarixi')}</span>
                        </Link>
                      )}

                      {(user.role === 'Admin' || user.role === 'Manager') && (
                        <Link
                          to="/manager"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <Boxes className="w-4 h-4 text-indigo-600" />
                          <span>{t('nav.productsAndStock', 'Mahsulotlar va ombor')}</span>
                        </Link>
                      )}

                      {(user.role === 'Admin' || user.role === 'CallCenter') && (
                        <Link
                          to="/callcenter"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <Headphones className="w-4 h-4 text-amber-600" />
                          <span>{t('nav.operatorOrders', 'Operator buyurtmalari')}</span>
                        </Link>
                      )}

                      {user.role === 'Admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-rose-600" />
                          <span>{t('nav.adminPanel', 'Admin boshqaruv paneli')}</span>
                        </Link>
                      )}
                    </div>

                    {/* Logout Action */}
                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors text-left group"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
                        <span>{t('nav.logout', 'Tizimdan chiqish')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive('/login')
                      ? 'bg-slate-950 text-white shadow-md shadow-slate-900/20'
                      : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/80'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{t('nav.login', 'Kirish')}</span>
                </Link>

                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 hidden lg:flex ${
                    isActive('/register')
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <span>{t('nav.register', "Ro'yxatdan o'tish")}</span>
                </Link>
              </div>
            )}

            {/* Language Selector Button with Flags */}
            <LanguageSelector />

            {/* Sevimlilar (Wishlist) Interactive Button */}
            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              className={`relative hidden sm:flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border transition-all duration-200 active:scale-95 group focus:outline-none cursor-pointer ${
                isActive('/wishlist')
                  ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
                  : 'border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs'
              }`}
              title={t('wishlist.title', 'Sevimlilar')}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  wishlistCount > 0 || isActive('/wishlist')
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-700 group-hover:text-rose-500'
                }`}
              />
              <span className={`text-xs font-bold hidden lg:inline ${isActive('/wishlist') ? 'text-rose-700' : 'text-slate-700 group-hover:text-slate-900'}`}>
                {t('nav.wishlist', 'Sevimlilar')}
              </span>

              {wishlistCount > 0 && (
                <span className="min-w-[18px] h-4.5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Interactive Pill Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all duration-200 active:scale-95 group focus:outline-none"
              title={t('cart.title', 'Savat')}
            >
              <ShoppingCart className="w-4 h-4 text-slate-700 group-hover:text-emerald-600 transition-colors" />
              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 hidden sm:inline">
                {t('nav.cart', 'Savat')}
              </span>

              {cartCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden border border-slate-200 focus:outline-none transition-colors"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* TIER 1.5 (Pastroqqa tushirilgan Katta Qidiruv va Katalog Qatori - Header ichida!) */}
        <div className="pb-3 pt-1 flex items-center gap-2.5 sm:gap-3.5">
          {/* Uzum-Style Katalog Button */}
          <button
            type="button"
            onClick={() => {
              navigate('/products');
            }}
            className="flex items-center gap-2 px-4 sm:px-6 h-12 sm:h-13 md:h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm md:text-base shadow-md shadow-emerald-600/25 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
          >
            <LayoutGrid className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            <span>{t('common.catalog', 'Katalog')}</span>
          </button>

          {/* Center: Massive Search Bar (Uzum-Market Style) - Full Width */}
          <div className="relative flex-1 w-full" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center group w-full">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 absolute left-4 sm:left-4.5 pointer-events-none transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('nav.searchPlaceholder', 'Mahsulotlar va turkumlarni qidirish (masalan: telefon, soat, noutbuk)...')}
                className="w-full h-12 sm:h-13 md:h-14 pl-12 sm:pl-14 pr-28 sm:pr-36 rounded-2xl border-2 border-emerald-500/40 hover:border-emerald-500 focus:border-emerald-600 bg-white text-sm sm:text-base md:text-[17px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all shadow-sm"
              />

              <div className="absolute right-1.5 sm:right-2 flex items-center gap-1 sm:gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    title={t('common.clear', 'Tozalash')}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="h-9.5 sm:h-11 px-4 sm:px-7 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm md:text-base font-black transition-all flex items-center gap-1.5 sm:gap-2 shadow-md shadow-emerald-600/25 active:scale-95 cursor-pointer"
                >
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  <span>{t('nav.searchBtn', 'Qidirish')}</span>
                </button>
              </div>
            </form>

            {/* Live Multilingual Results Flyout Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] border border-slate-200/90 p-2.5 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1.5 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    {t('nav.searchLiveTitle', "Ko'p tilli qidiruv natijalari:")}
                  </span>
                  <span>{searchResults.length} {t('common.itemsCount', 'ta tovar')}</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => handleExecuteSearch(prod.title)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/60 cursor-pointer transition-colors group"
                      >
                        <img
                          src={prod.image}
                          alt={prod.title}
                          onError={(e) => handleImageError(e, prod.title)}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0 border border-slate-200/60"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {prod.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {prod.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-extrabold text-slate-900">
                            ${prod.discountPrice || prod.price}
                          </p>
                          {prod.discountPrice && (
                            <p className="text-[10px] text-slate-400 line-through">
                              ${prod.price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleExecuteSearch()}
                      className="w-full mt-2 py-2 px-3 text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{t('nav.seeAllInCatalog', 'Barcha natijalarni katalogda ko\'rish')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-slate-500">
                    "{searchQuery}" {t('nav.noResultsFor', 'bo\'yicha mahsulot topilmadi')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Trenddagi Ommabop Qidiruvlar (Quick Trend Chips) */}
        <div className="hidden sm:flex items-center gap-2 pt-1 pb-2.5 px-1 text-xs overflow-x-auto no-scrollbar">
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 shrink-0">
            <Flame className="w-3 h-3 text-emerald-600" />
            {t('nav.trendTitle', 'Trendda:')}
          </span>
          {['iPhone 16 Pro', 'MacBook Air', 'Airfryer', 'Smart soat', 'Sony Quloqchin', 'Dyson', 'Sport kiyim', 'Powerbank'].map(item => (
            <button
              key={item}
              type="button"
              onClick={() => handleExecuteSearch(item)}
              className="px-2.5 py-0.5 rounded-lg bg-slate-100/90 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/70 text-[11px] font-medium text-slate-600 whitespace-nowrap transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* TIER 2 (Pastki Qavat - Ustma-Ust toifalar qatori): Uzum Market Categories Bar */}
      <div className="border-t border-slate-200/80 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              type="button"
              onClick={() => {
                navigate('/products');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                location.pathname === '/products' && (!location.search || location.search.includes('category=all'))
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <span>⚡</span>
              <span>{t('common.all', 'Barchasi')}</span>
            </button>

            {allCategories.map(cat => {
              const isSelected = location.pathname === '/products' && location.search.includes(`category=${cat.id}`);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    navigate(`/products?category=${cat.id}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white'
                  }`}
                >
                  <span className="text-xs">{CATEGORY_ICONS_MAP[cat.id] || '🏷️'}</span>
                  <span>{getCategoryName(cat)}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                navigate('/products?discount=true');
              }}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer ${
                location.pathname === '/products' && location.search.includes('discount=true')
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
              <span>{t('nav.weekDiscounts', 'Hafta Chegirmalari')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-slide-up shadow-xl">
          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
              isActive('/products')
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('common.allProducts', 'Barcha Mahsulotlar (Katalog)')}
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
              isActive('/wishlist')
                ? 'bg-rose-50 text-rose-900 border border-rose-200'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{t('wishlist.title', 'Sevimli Mahsulotlarim')}</span>
            </span>
            {wishlistCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user.role === 'User' && (
            <Link
              to="/my-orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                isActive('/my-orders')
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>{t('orders.title', 'Mening buyurtmalarim')}</span>
            </Link>
          )}

          {isAuthenticated && (user.role === 'CallCenter' || user.role === 'Admin') && (
            <Link
              to="/callcenter"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                isActive('/callcenter')
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Headphones className="w-4 h-4 text-amber-600" />
              <span>{t('nav.callcenter', 'Operator Paneli')}</span>
            </Link>
          )}

          {isAuthenticated && (user.role === 'Manager' || user.role === 'Admin') && (
            <Link
              to="/manager"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                isActive('/manager')
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Boxes className="w-4 h-4 text-indigo-600" />
              <span>{t('nav.warehouse', 'Ombor & Mahsulotlar Paneli')}</span>
            </Link>
          )}

          {isAuthenticated && user.role === 'Admin' && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 px-2 block">
                Administrator
              </span>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                  isActive('/admin')
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-rose-600" />
                <span>{t('nav.analytics', 'Admin Analitika')}</span>
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                  isActive('/admin/users')
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 text-rose-600" />
                <span>{t('nav.usersRoles', 'Foydalanuvchilar Boshqaruvi')}</span>
              </Link>
            </div>
          )}

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  isActive('/login')
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('nav.login', 'Kirish')}</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  isActive('/register')
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                }`}
              >
                <span>{t('nav.register', "Ro'yxatdan o'tish")}</span>
              </Link>
            </div>
          )}

          {/* Mobile Language Selector with Flags */}
          <div className="pt-3 border-t border-slate-100">
            <div className="px-2 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{t('nav.selectLanguage', 'Tilni tanlash')}</span>
              <span className="text-emerald-600 font-extrabold text-[10px]">{t('nav.langLabel', 'til / язык')}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FlagIcon code={lang.flagCode} className="w-4 h-3 shadow-2xs" />
                    <span className="truncate">{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
