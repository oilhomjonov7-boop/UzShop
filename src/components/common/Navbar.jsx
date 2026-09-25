import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
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
  CreditCard
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
  'cat-13': '🧸', // Bolalar Dunyosi
  'cat-14': '🎮'  // Geyming va Konsollar
};

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalCount, setIsCartOpen } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { t, getCategoryName, localizedCities, getLocalizedCityName } = useTranslation();
  const wishlistCount = wishlistIds?.length || 0;
  const cartCount = getTotalCount();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isControlMenuOpen, setIsControlMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Search & Location state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('uzshop_city') || 'Toshkent';
  });
  const [isCityOpen, setIsCityOpen] = useState(false);

  const menuRef = useRef(null);
  const controlMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const cityRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all products and categories
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

  // Multilingual live search results preview
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return filterProductsMultilingual(allProducts, searchQuery, allCategories).slice(0, 5);
  }, [allProducts, allCategories, searchQuery]);

  // Scroll detection for elevation
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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
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
    setSearchQuery(prev => (prev !== searchParam ? searchParam : prev));
  }, [location.search]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const handleExecuteSearch = (targetQuery = searchQuery) => {
    setIsSearchOpen(false);
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
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY STRIP: City Selector, Fast Links, Language & Theme */}
      {/* ========================================================================= */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 py-1.5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          
          {/* Left: City Selector & Fast Links */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {/* City Selector */}
            <div className="relative shrink-0" ref={cityRef}>
              <button
                type="button"
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white">{getLocalizedCityName(selectedCity)}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100/80 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                  {t('common.in1Day', '1 kunda')}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
                  <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
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
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{city.name}</span>
                        <span className="text-[10px] text-slate-400">{city.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

            {/* Fast Links */}
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/products?discount=true" className="hover:text-rose-600 flex items-center gap-1 font-bold text-rose-600 transition">
                <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                <span>{t('nav.discounts', 'Chegirmalar')}</span>
              </Link>
              <Link to="/products?sort=popular" className="hover:text-emerald-600 flex items-center gap-1 font-semibold transition">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{t('nav.popular', 'Ommabop')}</span>
              </Link>
              <Link to="/products" className="hover:text-emerald-600 hidden md:flex items-center gap-1 font-semibold transition">
                <CreditCard className="w-3 h-3 text-indigo-500" />
                <span>{t('nav.installment', '0-0-12 Nasiya')}</span>
              </Link>
            </div>
          </div>

          {/* Right: Language Selector + Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRIMARY MAIN BAR: Logo, Katalog + Qidiruv Bar, User, Wishlist, Cart */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
          
          {/* Left: Brand Logo */}
          <Link
            to="/"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
          >
            <div className="relative">
              <img
                src="/uzshop-emblem.png"
                alt="UZSHOP"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-md shadow-emerald-950/10 ring-1 ring-slate-200/80 dark:ring-slate-700 group-hover:scale-105 transition-all duration-300"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                UZ<span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">SHOP</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider uppercase hidden sm:block mt-0.5">
                {t('common.officialMarket', 'Rasmiy Market')}
              </span>
            </div>
          </Link>

          {/* Center: Katalog Button + Big Search Bar in ONE single row! */}
          <div className="flex-1 flex items-center gap-2 sm:gap-3 max-w-2xl lg:max-w-3xl">
            {/* Katalog Button */}
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 px-3.5 sm:px-5 h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            >
              <LayoutGrid className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">{t('common.catalog', 'Katalog')}</span>
            </button>

            {/* Search Input Bar */}
            <div className="relative flex-1 w-full" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 absolute left-3.5 sm:left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t('nav.searchPlaceholder', 'Mahsulotlarni qidirish (masalan: telefon, noutbuk)...')}
                  className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-20 sm:pr-28 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                />

                <div className="absolute right-1 sm:right-1.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="h-8.5 sm:h-9 px-3 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{t('nav.searchBtn', 'Qidirish')}</span>
                  </button>
                </div>
              </form>

              {/* Flyout Search Results */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-fade-in">
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      {t('nav.searchLiveTitle', "Qidiruv natijalari:")}
                    </span>
                    <span>{searchResults.length} {t('common.itemsCount', 'ta tovar')}</span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => handleExecuteSearch(prod.title)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/60 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                        >
                          <img
                            src={prod.image}
                            alt={prod.title}
                            onError={(e) => handleImageError(e, prod.title)}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200/60 dark:border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                              {prod.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {prod.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white">
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
                        className="w-full mt-2 py-2 px-3 text-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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

          {/* Right Action Icons: Login / Profile, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* If Staff / Admin: Boshqaruv Dropdown */}
            {isAuthenticated && (user.role === 'Admin' || user.role === 'Manager' || user.role === 'CallCenter') && (
              <div className="relative" ref={controlMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsControlMenuOpen(!isControlMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    ['/callcenter', '/manager', '/admin', '/admin/users'].some(p => isActive(p))
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden xl:inline">{t('nav.control', 'Boshqaruv')}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isControlMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isControlMenuOpen && (
                  <div className="absolute top-full right-0 mt-2.5 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                      {t('nav.staffSection', "Xodimlar boshqaruv bo'limi")}
                    </div>
                    {(user.role === 'CallCenter' || user.role === 'Admin') && (
                      <Link
                        to="/callcenter"
                        onClick={() => setIsControlMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-700 transition-colors"
                      >
                        <Headphones className="w-4 h-4 text-amber-500" />
                        <span>{t('nav.callcenter', 'Operator (CallCenter)')}</span>
                      </Link>
                    )}
                    {(user.role === 'Manager' || user.role === 'Admin') && (
                      <Link
                        to="/manager"
                        onClick={() => setIsControlMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 transition-colors"
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
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-rose-500" />
                          <span>{t('nav.analytics', 'Analitika & KPI')}</span>
                        </Link>
                        <Link
                          to="/admin/users"
                          onClick={() => setIsControlMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 transition-colors"
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

            {/* Profile Dropdown or Login */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white font-black text-xs flex items-center justify-center">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white hidden lg:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700 mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">{t('nav.userRole', 'Roli')}:</span>
                        <RoleBadge role={user.role} size="sm" />
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        to="/my-orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2.5 transition-colors"
                      >
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>{t('nav.historyOrders', 'Buyurtmalarim tarixi')}</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>{t('nav.logout', 'Tizimdan chiqish')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <User className="w-4 h-4" />
                <span>{t('nav.login', 'Kirish')}</span>
              </Link>
            )}

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              className={`relative p-2 sm:px-3 sm:py-2 rounded-xl border transition-all active:scale-95 group focus:outline-none cursor-pointer ${
                isActive('/wishlist')
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={t('wishlist.title', 'Sevimlilar')}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  wishlistCount > 0 || isActive('/wishlist')
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-700 dark:text-slate-300 group-hover:text-rose-500'
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-all active:scale-95 group focus:outline-none cursor-pointer"
              title={t('cart.title', 'Savat')}
            >
              <ShoppingCart className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden md:inline">
                {t('nav.cart', 'Savat')}
              </span>
              {cartCount > 0 && (
                <span className="min-w-[18px] h-4.5 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden border border-slate-200 dark:border-slate-700 focus:outline-none transition-colors cursor-pointer"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CATEGORIES BAR: Horizontal smooth-scrolling chip list */}
      {/* ========================================================================= */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                location.pathname === '/products' && (!location.search || location.search.includes('category=all'))
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
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
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">{CATEGORY_ICONS_MAP[cat.id] || '🏷️'}</span>
                  <span>{getCategoryName(cat)}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => navigate('/products?discount=true')}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer ${
                location.pathname === '/products' && location.search.includes('discount=true')
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>{t('nav.weekDiscounts', 'Hafta Chegirmalari')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE DRAWER */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 animate-slide-up shadow-xl">
          <div className="pb-1">
            <ThemeToggle variant="mobile" />
          </div>

          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
              isActive('/products')
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t('common.allProducts', 'Barcha Mahsulotlar (Katalog)')}
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
              isActive('/wishlist')
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>{t('orders.title', 'Mening buyurtmalarim')}</span>
            </Link>
          )}

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 text-white shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>{t('nav.login', 'Kirish')}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
