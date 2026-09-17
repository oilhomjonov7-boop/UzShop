import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../../api/client';
import { ProductCard } from '../../components/shop/ProductCard';
import { ProductDetailModal } from '../../components/shop/ProductDetailModal';
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
  'cat-13': '🧸'  // Bolalar Dunyosi
};

// Helper to accurately return emoji matching product type/category
export const getProductCategoryEmoji = (product) => {
  if (!product) return '🛍️';
  const text = `${product.title || ''} ${product.categoryId || ''} ${product.description || ''}`.toLowerCase();
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

const PROMO_SLIDES = [
  {
    id: 1,
    badge: "🔥 BAHORIY MEGA CHEGIRMALAR",
    title: "50% gacha Super Chegirmalar",
    subtitle: "Eng sara smartfonlar, noutbuklar va gadjetlarga rasmiy kafolat bilan maxsus narxlar!",
    ctaText: "Xarid qilish",
    actionCategory: "cat-1",
    tag: "Aksiya",
    bgGradient: "from-emerald-900 via-teal-950 to-slate-950",
    accentColor: "from-emerald-400 to-teal-300",
    highlight: "Kafolatlangan chegirma",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    badge: "⚡ 1 KUNDA YETKAZISH • 100% BEPUL",
    title: "Butun O'zbekiston Bo'ylab Yetkazish",
    subtitle: "Bugun xarid qiling — ertaga ostonangizda qabul qiling. Tezkor kuryerlik xizmati!",
    ctaText: "Katalogni ko'rish",
    actionCategory: "all",
    tag: "Tezkor",
    bgGradient: "from-indigo-950 via-slate-900 to-blue-950",
    accentColor: "from-cyan-400 to-indigo-300",
    highlight: "24 soatda yetkazish",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    badge: "✨ YANGI MAVSUM TRENDLARI",
    title: "Zamonaviy Kiyim & Poyabzallar",
    subtitle: "Erkaklar va ayollar uchun yangi mavsum kolleksiyasi: bejirim uslub va yuqori qulaylik!",
    ctaText: "Kolleksiyani tanlash",
    actionCategory: "cat-6",
    tag: "Yangi",
    bgGradient: "from-slate-950 via-stone-900 to-amber-950",
    accentColor: "from-amber-400 to-orange-300",
    highlight: "Yangi kolleksiya",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    badge: "💳 0-0-12 MUDDATLI TO'LOV",
    title: "Boshlang'ich To'lovsiz Bo'lib To'lash",
    subtitle: "Ortiqcha foizsiz va hujjatlarsiz 12 oygacha qulay muddatli xarid imkoniyati!",
    ctaText: "Barchasini ko'rish",
    actionCategory: "all",
    tag: "0% Nasiya",
    bgGradient: "from-teal-950 via-slate-900 to-cyan-950",
    accentColor: "from-emerald-300 to-cyan-300",
    highlight: "0% Boshlang'ich to'lov",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
  }
];

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

  const promoSlides = useMemo(() => {
    return PROMO_SLIDES.map((slide, idx) => ({
      ...slide,
      badge: t(`catalog.slides.${idx}.badge`, slide.badge),
      title: t(`catalog.slides.${idx}.title`, slide.title),
      subtitle: t(`catalog.slides.${idx}.subtitle`, slide.subtitle),
      ctaText: t(`catalog.slides.${idx}.ctaText`, slide.ctaText),
      highlight: t(`catalog.slides.${idx}.highlight`, slide.highlight)
    }));
  }, [t, currentLanguage]);

  // Carousel & Deal of the Day state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Countdown timer state for Kun Tovari
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

  // Carousel auto-advance (every 5 seconds)
  useEffect(() => {
    if (isSlidePaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSlidePaused, promoSlides.length]);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  // Dedicated flagship catalog for the hero "Kun Tovari" card
  const { data: allHeroCatalog = [] } = useQuery({
    queryKey: ['hero-all-products'],
    queryFn: () => productsApi.getAll(),
    staleTime: 1000 * 60 * 5
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

  // Featured flagship showcase items (iPhone 15 Pro Max, MacBook Pro 16, Apple Watch Ultra 2)
  const heroFeaturedProducts = useMemo(() => {
    const sourceList = allHeroCatalog.length ? allHeroCatalog : products;
    if (!sourceList.length) return [];
    const ids = ['prod-101', 'prod-104', 'prod-107']; // iPhone, MacBook, Apple Watch
    const matched = ids.map(id => sourceList.find(p => p.id === id)).filter(Boolean);
    return matched.length === 3 ? matched : sourceList.slice(0, 3);
  }, [allHeroCatalog, products]);

  const activeFeaturedProduct = heroFeaturedProducts[featuredIndex] || heroFeaturedProducts[0] || null;

  const handleHeroAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (!product) return;
    const added = addItem(product, 1);
    if (added) {
      showToast.success(`"${product.title}" savatchaga qo'shildi!`);
    }
  };

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

  const handleBannerAction = (slide) => {
    if (slide.actionCategory && slide.actionCategory !== 'all') {
      navigate(`/products?category=${slide.actionCategory}`);
    } else {
      navigate('/products');
    }
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
    <div className="min-h-screen pb-16">
      {/* ========================================================================= */}
      {/* HERO MARKETPLACE SHOWCASE (Uzum Market Style Carousel + Deal of the Day) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Main Promo Banner Carousel (8 Columns on Desktop) */}
          <div
            className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 min-h-[340px] sm:min-h-[390px] flex flex-col justify-between group select-none"
            onMouseEnter={() => setIsSlidePaused(true)}
            onMouseLeave={() => setIsSlidePaused(false)}
          >
            {/* Background Gradient & Pattern */}
            <div className={`absolute inset-0 bg-gradient-to-r ${promoSlides[currentSlide].bgGradient} transition-colors duration-700`} />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.7px,transparent_0.7px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            {/* Slide Content */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full">
              {/* Top Badge & Slide Indicator */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-wide shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>{promoSlides[currentSlide].badge}</span>
                </span>

                <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white/90 text-[11px] font-bold border border-white/10">
                  {currentSlide + 1} / {promoSlides.length}
                </span>
              </div>

              {/* Main Heading & Subtitle */}
              <div className="my-auto py-5 max-w-lg">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {promoSlides[currentSlide].title}
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {promoSlides[currentSlide].subtitle}
                </p>

                {/* Banner Actions */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => handleBannerAction(promoSlides[currentSlide])}
                    className="px-6 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 group/btn cursor-pointer"
                  >
                    <span>{promoSlides[currentSlide].ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-emerald-600" />
                  </button>

                  <span className="px-3.5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold hidden sm:inline-block">
                    {promoSlides[currentSlide].highlight}
                  </span>
                </div>
              </div>

              {/* Bottom Navigation Dots & Manual Arrow Buttons */}
              <div className="flex items-center justify-between gap-4 pt-2">
                {/* Dots / Pills */}
                <div className="flex items-center gap-2">
                  {promoSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentSlide === idx
                          ? 'w-8 bg-white shadow-sm'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentSlide(prev => (prev - 1 + promoSlides.length) % promoSlides.length)}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                    aria-label={t('catalog.pagination.prev', 'Oldingi')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev + 1) % promoSlides.length)}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                    aria-label={t('catalog.pagination.next', 'Keyingi')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Deal of the Day / Kun Tovari Card (4 Columns on Desktop) */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/90 shadow-md p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
            {/* Top Section */}
            <div>
              {/* Badge & Countdown Timer */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-black">
                  <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>{t('catalog.dealOfTheDay', 'KUN TOVARI')}</span>
                </span>

                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3 h-3 text-rose-500" />
                  <span>
                    {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Dynamic Tabs with Emojis Strictly Matching Each Product! */}
              {heroFeaturedProducts.length > 1 && (
                <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl mb-3">
                  {heroFeaturedProducts.map((p, idx) => {
                    const isSelected = featuredIndex === idx;
                    const emoji = getProductCategoryEmoji(p);
                    return (
                      <button
                        key={p.id}
                        onClick={() => setFeaturedIndex(idx)}
                        className={`flex-1 py-1 px-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 font-extrabold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <span className="text-sm">{emoji}</span>
                        <span className="truncate max-w-[70px] sm:max-w-[85px] text-[11px]">
                          {p.title.split(' ')[0]} {p.title.split(' ')[1] || ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Product Image Showcase */}
              {activeFeaturedProduct && (
                <div
                  onClick={() => setSelectedProduct(activeFeaturedProduct)}
                  className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 cursor-pointer group/img mb-3"
                >
                  <img
                    src={activeFeaturedProduct.image}
                    alt={activeFeaturedProduct.title}
                    onError={(e) => handleImageError(e, activeFeaturedProduct.title)}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />

                  {activeFeaturedProduct.discountPrice && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black shadow-md">
                      -${activeFeaturedProduct.price - activeFeaturedProduct.discountPrice} {t('catalog.discountOff', 'Chegirma')}
                    </span>
                  )}

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold border border-slate-200 flex items-center gap-1 shadow-xs">
                    <span>⭐ {activeFeaturedProduct.rating || '4.9'}</span>
                    <span className="text-slate-400">({activeFeaturedProduct.salesCount || 30}+ {t('catalog.purchases', 'xarid')})</span>
                  </div>
                </div>
              )}

              {/* Product Title with Category Emoji & Description */}
              {activeFeaturedProduct && (
                <div>
                  <h3
                    onClick={() => setSelectedProduct(activeFeaturedProduct)}
                    className="text-sm sm:text-base font-black text-slate-900 hover:text-emerald-700 transition cursor-pointer flex items-center gap-1.5 truncate"
                  >
                    <span>{getProductCategoryEmoji(activeFeaturedProduct)}</span>
                    <span className="truncate">{activeFeaturedProduct.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                    {activeFeaturedProduct.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Section: Price & Add to Cart */}
            {activeFeaturedProduct && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    ${activeFeaturedProduct.discountPrice || activeFeaturedProduct.price}
                  </p>
                  {activeFeaturedProduct.discountPrice && (
                    <p className="text-xs text-slate-400 line-through">
                      ${activeFeaturedProduct.price}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => handleHeroAddToCart(activeFeaturedProduct, e)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('catalog.addToCart', 'Savatga')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4-Pillar Trust Ribbon (Uzum Market Kafolati) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-5">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t('catalog.trustPillars.oneDayTitle', '1 Kunda Yetkazish')}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t('catalog.trustPillars.oneDayDesc', "O'zbekiston bo'ylab 24 soatda")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t('catalog.trustPillars.originalTitle', '100% Original Sifat')}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t('catalog.trustPillars.originalDesc', 'Rasmiy kafolat & sifat nazorati')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t('catalog.trustPillars.returnsTitle', '14 Kun Qaytarish')}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t('catalog.trustPillars.returnsDesc', 'Oson va muammosiz almashtirish')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t('catalog.trustPillars.installmentTitle', "Qulay Muddatli To'lov")}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t('catalog.trustPillars.installmentDesc', '0-0-12 Payme, Uzum Nasiya')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN CATALOG & PRODUCTS SECTION */}
      {/* ========================================================================= */}
      <div id="catalog-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Streamlined Filter & Sort Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category / Search Indicator */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{currentCategoryMeta.icon}</span>
                <span>{currentCategoryMeta.title}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {products.length} {t('common.productsCount', 'ta mahsulot')}
                </span>
              </h2>
              {urlSearch && (
                <p className="text-xs text-slate-500 mt-1">
                  {t('filters.searchSubtext', "so'rovi bo'yicha sara natijalar")}
                </p>
              )}
            </div>

            {/* Filter Tools: Price Filter & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Price inputs */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">{t('catalog.priceFilter.title', 'Narx ($):')}</span>
                <input
                  type="number"
                  placeholder={t('catalog.priceFilter.from', 'Dan')}
                  value={priceRange.min}
                  onChange={(e) => {
                    setPriceRange(p => ({ ...p, min: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-16 sm:w-20 px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
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
                  className="w-16 sm:w-20 px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Sorting Select */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer shadow-xs"
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
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition border border-rose-200 flex items-center gap-1 cursor-pointer active:scale-95"
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
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50/80 via-amber-50/70 to-orange-50/80 border border-rose-200/70 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{t('filters.allDiscountsTitle', 'Mega Chegirmalar & Maxsus Takliflar')}</h3>
                  <p className="text-xs text-slate-500">{t('filters.searchSubtext', 'Eng yuqori chegirmaga ega tovarlar')}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/products?discount=true')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer"
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

        {/* Results Info Bar & Items Per Page */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <p className="text-xs text-slate-500 font-medium">
            {products.length > 0
              ? `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, products.length)} / ${products.length} ${t('common.productsCount', 'ta mahsulot')}`
              : t('catalog.empty.title', "Mahsulotlar topilmadi")}
          </p>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">{t('catalog.pagination.page', 'Sahifa')}:</span>
            {[10, 15, 20, 30, 50].map(size => (
              <button
                key={size}
                onClick={() => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition text-xs cursor-pointer ${
                  itemsPerPage === size
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">{t('catalog.empty.title', 'Xatolik yuz berdi')}</h3>
            <p className="text-xs text-slate-500 mt-1">{t('catalog.empty.desc', 'Iltimos, qayta urinib ko\'ring.')}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{t('catalog.empty.title', 'Hech qanday mahsulot topilmadi')}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {t('catalog.empty.desc', "Qidiruv parametrlarini o'zgartirib ko'ring yoki filtrlarni tozalang.")}
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition"
            >
              {t('catalog.empty.btn', 'Filtrlarni tozalash')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
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
              <span>100% {t('catalog.trustPillars.originalTitle', 'Original Sifat')}</span>
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
