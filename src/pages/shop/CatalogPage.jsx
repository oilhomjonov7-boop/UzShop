import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../../api/client';
import { ProductCard } from '../../components/shop/ProductCard';
import { ProductDetailModal } from '../../components/shop/ProductDetailModal';
import { HeroBannerSwiper } from '../../components/shop/HeroBannerSwiper';
import { ProductSkeleton } from '../../components/common/SkeletonLoader';
import { handleImageError } from '../../utils/imageFallback';
import {
  Sparkles,
  ShoppingBag,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Flame,
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  ShoppingCart,
  Clock,
  ArrowRight,
  Search
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { showToast } from '../../components/common/Toast';
import { useTranslation } from '../../utils/useTranslation';

const CATEGORY_ICONS_MAP = {
  'cat-1': '📱', // Smartfonlar
  'cat-2': '💻', // Noutbuklar
  'cat-3': '⌚', // Smart soatlar
  'cat-4': '🎧', // Quloqchinlar
  'cat-5': '🔌', // Aksessuarlar
  'cat-6': '👟', // Kiyim va Poyabzal
  'cat-7': '🏠', // Uy va Oshxona
  'cat-8': '🏋️', // Sport va Fitnes
  'cat-9': '📚', // Kitoblar
  'cat-10': '💄', // Go'zallik & Parvarish
  'cat-11': '☕', // Qahva va Oziq-ovqat
  'cat-12': '🚗', // Avtotovarlar
  'cat-13': '🧸', // Bolalar Dunyosi
  'cat-14': '🎮'  // Geyming va Konsollar
};

// Helper to accurately return emoji matching product type/category
export const getProductCategoryEmoji = (product) => {
  if (!product) return '🛍️';
  const text = `${product.title || ''} ${product.categoryId || ''} ${product.description || ''}`.toLowerCase();
  if (text.includes('playstation') || text.includes('ps5') || text.includes('xbox') || text.includes('nintendo') || text.includes('gaming') || text.includes('geyming') || text.includes('geympad') || text.includes('switch') || product.categoryId === 'cat-14') {
    return '🎮';
  }
  if (text.includes('iphone') || text.includes('smartfon') || text.includes('samsung') || text.includes('xiaomi') || text.includes('telefon') || text.includes('phone') || product.categoryId === 'cat-1') {
    return '📱';
  }
  if (text.includes('macbook') || text.includes('noutbuk') || text.includes('laptop') || text.includes('asus') || text.includes('kompyuter') || product.categoryId === 'cat-2') {
    return '💻';
  }
  if (text.includes('watch') || text.includes('soat') || product.categoryId === 'cat-3') {
    return '⌚';
  }
  if (text.includes('quloqchin') || text.includes('headphone') || text.includes('airpods') || text.includes('buds') || product.categoryId === 'cat-4') {
    return '🎧';
  }
  if (text.includes('aksessuar') || text.includes('kabel') || text.includes('zaryad') || product.categoryId === 'cat-5') {
    return '🔌';
  }
  if (text.includes('kiyim') || text.includes('shirt') || text.includes('krossovka') || text.includes('poyabzal') || text.includes('futbolka') || product.categoryId === 'cat-6') {
    return '👟';
  }
  if (text.includes('oshxona') || text.includes('uy') || text.includes('choynak') || text.includes('idish') || product.categoryId === 'cat-7') {
    return '🏠';
  }
  if (text.includes('sport') || text.includes('fitnes') || text.includes('dumbbell') || product.categoryId === 'cat-8') {
    return '🏋️';
  }
  if (text.includes('kitob') || text.includes('book') || product.categoryId === 'cat-9') {
    return '📚';
  }
  if (text.includes('go\'zallik') || text.includes('parvarish') || text.includes('krem') || text.includes('atir') || product.categoryId === 'cat-10') {
    return '💄';
  }
  if (text.includes('qahva') || text.includes('coffee') || text.includes('choy') || product.categoryId === 'cat-11') {
    return '☕';
  }
  if (text.includes('avto') || text.includes('car') || text.includes('mashina') || product.categoryId === 'cat-12') {
    return '🚗';
  }
  if (text.includes('bola') || text.includes('baby') || text.includes('o\'yinchoq') || product.categoryId === 'cat-13') {
    return '🧸';
  }
  return '✨';
};

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';

  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const { addItem } = useCartStore();
  const { t, getCategoryName, currentLanguage } = useTranslation();

  // Countdown timer state for hot deals showcase
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 48, seconds: 25 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Products for the main catalog
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategory, urlSearch, sortOption, priceRange],
    queryFn: () => productsApi.getAll({
      categoryId: selectedCategory,
      search: urlSearch,
      sort: sortOption,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    }),
    staleTime: 1000 * 60 * 2,
  });

  // Top hot deals
  const hotDeals = useMemo(() => {
    return products.filter(p => p.discountPrice && p.price > p.discountPrice).slice(0, 4);
  }, [products]);

  // Pagination calculation
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);


  const handleCategorySelect = (catId) => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  // When search query is in URL, auto-scroll to catalog results
  useEffect(() => {
    if (urlSearch) {
      const el = document.getElementById('catalog-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [urlSearch]);

  const handleClearFilters = () => {
    setSortOption('default');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newParams.delete('search');
    setSearchParams(newParams);
  };


  const hasActiveFilters = selectedCategory !== 'all' || urlSearch || priceRange.min || priceRange.max || sortOption !== 'default';

  // Dynamic category title & emoji calculation for the catalog header
  const currentCategoryMeta = useMemo(() => {
    if (urlSearch) {
      return { icon: '🔍', title: `"${urlSearch}"` };
    }
    if (selectedCategory === 'all') {
      return { icon: '⚡', title: t('common.allProducts', 'Barcha Mahsulotlar') };
    }
    const found = categories.find(c => c.id === selectedCategory);
    return {
      icon: found ? (CATEGORY_ICONS_MAP[found.id] || '🏷️') : '🛍️',
      title: found ? getCategoryName(found) : t('common.catalog', 'Mahsulotlar')
    };
  }, [urlSearch, selectedCategory, categories, getCategoryName, t]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      {/* ========================================================================= */}
      {/* HERO MARKETPLACE SHOWCASE (Big Swiper Banner + 4-Pillar Trust Ribbon) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* BIG HERO BANNER SWIPER */}
        <HeroBannerSwiper />

        {/* 4-Pillar Trust Ribbon (Uzum Market Kafolati) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-5">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('catalog.trustPillars.oneDayTitle', '1 Kunda Yetkazish')}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t('catalog.trustPillars.oneDayDesc', "O'zbekiston bo'ylab 24 soatda")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('catalog.trustPillars.originalTitle', '100% Original Sifat')}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t('catalog.trustPillars.originalDesc', 'Rasmiy kafolat & sifat nazorati')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('catalog.trustPillars.returnsTitle', '14 Kun Qaytarish')}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t('catalog.trustPillars.returnsDesc', 'Oson va muammosiz almashtirish')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('catalog.trustPillars.installmentTitle', "Qulay Muddatli To'lov")}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t('catalog.trustPillars.installmentDesc', '0-0-12 Payme, Uzum Nasiya')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN CATALOG & PRODUCTS SECTION */}
      {/* ========================================================================= */}
      <div id="catalog-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Streamlined Filter & Sort Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category / Search Indicator */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentCategoryMeta.icon}</span>
                <span>{currentCategoryMeta.title}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60">
                  {products.length} {t('common.productsCount', 'ta mahsulot')}
                </span>
              </h2>
              {urlSearch && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('filters.searchSubtext', "so'rovi bo'yicha sara natijalar")}
                </p>
              )}
            </div>

            {/* Filter Tools: Price Filter & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Price inputs */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('catalog.priceFilter.title', 'Narx ($):')}</span>
                <input
                  type="number"
                  placeholder={t('catalog.priceFilter.from', 'Dan')}
                  value={priceRange.min}
                  onChange={(e) => {
                    setPriceRange(p => ({ ...p, min: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-16 sm:w-20 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder={t('catalog.priceFilter.to', 'Gacha')}
                  value={priceRange.max}
                  onChange={(e) => {
                    setPriceRange(p => ({ ...p, max: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-16 sm:w-20 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Sorting Select */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer shadow-xs"
                >
                  <option value="default">{t('catalog.sort.popular', 'Saralash: Eng ommabop')}</option>
                  <option value="popular">{t('catalog.sort.mostBought', "Eng ko'p sotilgan")}</option>
                  <option value="rating">{t('catalog.sort.rating', "Reyting bo'yicha")}</option>
                  <option value="price-asc">{t('catalog.sort.priceAsc', 'Narx: Arzondan qimmatga')}</option>
                  <option value="price-desc">{t('catalog.sort.priceDesc', 'Narx: Qimmatdan arzonga')}</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Clear active filters button */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition border border-rose-200 dark:border-rose-800 flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t('catalog.priceFilter.clearFilter', 'Tozalash')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hot Deals Showcase Section (When viewing all products and no search) */}
        {selectedCategory === 'all' && !urlSearch && hotDeals.length > 0 && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50/80 via-amber-50/70 to-orange-50/80 dark:from-rose-950/30 dark:via-amber-950/20 dark:to-orange-950/30 border border-rose-200/70 dark:border-rose-900/40 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 flex-shrink-0">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{t('filters.allDiscountsTitle', 'Mega Chegirmalar & Qaynoq Takliflar')}</h3>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/70 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                      <Clock className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('filters.searchSubtext', 'Faqat tanlangan aksiyadagi tovarlar')}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/products?discount=true')}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
              >
                <span>{t('nav.seeAllInCatalog', "Barchasini ko'rish")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {hotDeals.map(deal => (
                <ProductCard
                  key={`hot-${deal.id}`}
                  product={deal}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error Fallback */}
        {isError && (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center max-w-md mx-auto my-8">
            <p className="text-rose-800 dark:text-rose-300 font-bold mb-2">{t('common.errorLoading')}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Empty Catalog State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              {t('common.noProductsFound')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {t('filters.searchSubtext')}
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
            >
              {t('catalog.priceFilter.clearFilter')}
            </button>
          </div>
        )}

        {/* Main Products Grid */}
        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {paginatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Big CTA Banner linking to the full Mega Catalog page */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-lg border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('catalog.trustPillars.originalTitle', '100% Original Sifat')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {t('common.allProducts', 'Barcha Mahsulotlar')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {t('footer.aboutText', 'UzShop — sifatli mahsulotlar, qulay muddatli to\'lov va tezkor yetkazib berish xizmati.')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>{t('nav.seeAllInCatalog', "To'liq katalogga o'tish")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
