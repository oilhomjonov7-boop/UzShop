import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../../api/client';
import { ProductCard } from '../../components/shop/ProductCard';
import { ProductDetailModal } from '../../components/shop/ProductDetailModal';
import { ProductSkeleton } from '../../components/common/SkeletonLoader';
import { useTranslation } from '../../utils/useTranslation';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Flame,
  Star,
  Check,
  ChevronDown,
  LayoutGrid,
  Filter,
  Sparkles,
  Package,
  RotateCcw
} from 'lucide-react';

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

export const ProductsPage = () => {
  const { t, getCategoryName } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from URL
  const selectedCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';
  const urlSort = searchParams.get('sort') || 'default';
  const urlMinPrice = searchParams.get('minPrice') || '';
  const urlMaxPrice = searchParams.get('maxPrice') || '';
  const urlDiscountOnly = searchParams.get('discount') === 'true';
  const urlInStockOnly = searchParams.get('inStock') === 'true';
  const urlMinRating = searchParams.get('rating') || '';

  // Local state
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [priceRange, setPriceRange] = useState({ min: urlMinPrice, max: urlMaxPrice });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSearchInput(urlSearch);
    setPriceRange({ min: urlMinPrice, max: urlMaxPrice });
  }, [urlSearch, urlMinPrice, urlMaxPrice]);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Products with all active filters
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: [
      'all-catalog-products',
      selectedCategory,
      urlSearch,
      urlSort,
      urlMinPrice,
      urlMaxPrice,
      urlDiscountOnly,
      urlInStockOnly,
      urlMinRating
    ],
    queryFn: () => productsApi.getAll({
      categoryId: selectedCategory,
      search: urlSearch,
      sort: urlSort,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      discountOnly: urlDiscountOnly,
      inStockOnly: urlInStockOnly,
      minRating: urlMinRating
    }),
    staleTime: 1000 * 60 * 2,
  });

  // Fetch all products to calculate category counts
  const { data: allUnfilteredProducts = [] } = useQuery({
    queryKey: ['unfiltered-products-counts'],
    queryFn: () => productsApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const categoryCounts = useMemo(() => {
    const counts = { all: allUnfilteredProducts.length };
    allUnfilteredProducts.forEach(p => {
      if (p.categoryId) {
        counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [allUnfilteredProducts]);

  // Pagination calculation
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  const updateFilterParam = (key, value) => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false || value === 'all' || value === 'default') {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catId) => {
    updateFilterParam('category', catId);
  };

  const handleApplyPriceFilter = () => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (priceRange.min) newParams.set('minPrice', priceRange.min);
    else newParams.delete('minPrice');

    if (priceRange.max) newParams.set('maxPrice', priceRange.max);
    else newParams.delete('maxPrice');

    setSearchParams(newParams);
  };

  const handlePricePreset = (min, max) => {
    setPriceRange({ min: min || '', max: max || '' });
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set('minPrice', String(min));
    else newParams.delete('minPrice');

    if (max) newParams.set('maxPrice', String(max));
    else newParams.delete('maxPrice');

    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    urlSearch || 
    urlMinPrice || 
    urlMaxPrice || 
    urlSort !== 'default' || 
    urlDiscountOnly || 
    urlInStockOnly || 
    urlMinRating;

  const activeFiltersCount = [
    selectedCategory !== 'all',
    Boolean(urlSearch),
    Boolean(urlMinPrice || urlMaxPrice),
    urlSort !== 'default',
    urlDiscountOnly,
    urlInStockOnly,
    Boolean(urlMinRating)
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-slate-900 transition font-medium">
            {t('nav.home')}
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700">{t('nav.catalog')}</span>
          {activeCategoryObj && (
            <>
              <span>/</span>
              <span className="font-bold text-emerald-600">
                {CATEGORY_ICONS_MAP[activeCategoryObj.id]} {getCategoryName(activeCategoryObj)}
              </span>
            </>
          )}
          {urlSearch && (
            <>
              <span>/</span>
              <span className="font-bold text-slate-900">
                "{urlSearch}"
              </span>
            </>
          )}
        </nav>

        {/* Page Main Grid: Left Sidebar (Desktop) + Products Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================================= */}
          {/* DESKTOP FILTER SIDEBAR (3 Columns) */}
          {/* ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-900">{t('filters.title')}</h3>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('filters.clearAll')}</span>
                </button>
              )}
            </div>

            {/* Category Filter List */}
            <div className="py-4 border-b border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                {t('filters.categories')}
              </h4>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>{t('filters.allGoods')}</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {categoryCounts.all || 0}
                  </span>
                </button>

                {categories.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span>{CATEGORY_ICONS_MAP[cat.id] || '🏷️'}</span>
                        <span className="truncate">{getCategoryName(cat)}</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="py-4 border-b border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                {t('filters.priceRange')}
              </h4>

              <div className="grid grid-cols-2 gap-2 mb-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">{t('filters.from')}</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-1">{t('filters.to')}</label>
                  <input
                    type="number"
                    placeholder="3000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Price Preset Chips */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <button
                  type="button"
                  onClick={() => handlePricePreset('', '100')}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 transition"
                >
                  {t('filters.upTo100')}
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset('100', '500')}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 transition"
                >
                  {t('filters.range100_500')}
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset('500', '1000')}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 transition"
                >
                  {t('filters.range500_1000')}
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset('1000', '')}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 transition"
                >
                  {t('filters.above1000')}
                </button>
              </div>

              <button
                type="button"
                onClick={handleApplyPriceFilter}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                {t('filters.applyPrice')}
              </button>
            </div>

            {/* Quick Toggles */}
            <div className="py-4 space-y-2.5 border-b border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                {t('filters.specialOffers')}
              </h4>

              {/* Discount Only Toggle */}
              <label className="flex items-center justify-between cursor-pointer py-1 group">
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t('filters.onlyDiscounted')}</span>
                </span>
                <input
                  type="checkbox"
                  checked={urlDiscountOnly}
                  onChange={(e) => updateFilterParam('discount', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              {/* In-Stock Only Toggle */}
              <label className="flex items-center justify-between cursor-pointer py-1 group">
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('filters.onlyInStock')}</span>
                </span>
                <input
                  type="checkbox"
                  checked={urlInStockOnly}
                  onChange={(e) => updateFilterParam('inStock', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              {/* High Rating Only */}
              <label className="flex items-center justify-between cursor-pointer py-1 group">
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{t('filters.highRating')}</span>
                </span>
                <input
                  type="checkbox"
                  checked={urlMinRating === '4.8'}
                  onChange={(e) => updateFilterParam('rating', e.target.checked ? '4.8' : '')}
                  className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* MAIN PRODUCTS AREA (9 Columns on Desktop) */}
          {/* ========================================================================= */}
          <main className="lg:col-span-9">
            {/* Top Toolbar Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 mb-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                {/* Title & Count */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                    <span>
                      {urlSearch
                        ? t('filters.searchResultsTitle')
                        : activeCategoryObj
                        ? `${CATEGORY_ICONS_MAP[activeCategoryObj.id] || '🏷️'} ${getCategoryName(activeCategoryObj)}`
                        : urlDiscountOnly
                        ? t('filters.allDiscountsTitle')
                        : t('filters.allCatalogTitle')}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                      {products.length} {t('common.itemsCount')}
                    </span>
                  </h1>

                  {urlSearch && (
                    <p className="text-xs text-slate-500 mt-1">
                      "{urlSearch}" {t('filters.searchSubtext')}
                    </p>
                  )}
                </div>

                {/* Right controls: Sorting Dropdown & Mobile Filter */}
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  {/* Mobile Filter Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                    <span>{t('filters.title')}</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Sorting Select */}
                  <div className="relative">
                    <select
                      value={urlSort}
                      onChange={(e) => updateFilterParam('sort', e.target.value)}
                      className="appearance-none pl-3.5 pr-9 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-slate-700 hover:border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer shadow-xs"
                    >
                      <option value="default">{t('catalog.sort.popular')}</option>
                      <option value="popular">{t('catalog.sort.mostBought')}</option>
                      <option value="rating">{t('catalog.sort.rating')}</option>
                      <option value="price-asc">{t('catalog.sort.priceAsc')}</option>
                      <option value="price-desc">{t('catalog.sort.priceDesc')}</option>
                      <option value="discount">{t('catalog.sort.discount')}</option>
                    </select>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Katta, Keng va Qulay Qidiruv Maydoni (Huge Dedicated Catalog Search Bar) */}
              <div className="pt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateFilterParam('search', searchInput.trim());
                  }}
                  className="relative flex items-center group w-full"
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 absolute left-4 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t('filters.searchCatalogPlaceholder')}
                    className="w-full pl-12 sm:pl-14 pr-28 sm:pr-36 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 focus:border-emerald-500 bg-slate-50/70 hover:bg-white focus:bg-white text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all shadow-inner"
                  />
                  <div className="absolute right-2 flex items-center gap-1.5">
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput('');
                          updateFilterParam('search', '');
                        }}
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
                        title={t('common.clear')}
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                      title={t('common.search')}
                    >
                      <Search className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('common.search')}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 flex-wrap">
                  <span className="text-xs text-slate-400 font-medium">{t('filters.activeFilters')}</span>

                  {selectedCategory !== 'all' && activeCategoryObj && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <span>{CATEGORY_ICONS_MAP[activeCategoryObj.id]} {getCategoryName(activeCategoryObj)}</span>
                      <button onClick={() => handleCategorySelect('all')} className="hover:text-emerald-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {urlSearch && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                      <span>{t('filters.searchBadge')} "{urlSearch}"</span>
                      <button onClick={() => updateFilterParam('search', '')} className="hover:text-slate-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {(urlMinPrice || urlMaxPrice) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                      <span>{t('filters.priceBadge')} ${urlMinPrice || '0'} - ${urlMaxPrice || '∞'}</span>
                      <button onClick={() => handlePricePreset('', '')} className="hover:text-slate-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {urlDiscountOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                      <span>{t('filters.onlyDiscounted')}</span>
                      <button onClick={() => updateFilterParam('discount', false)} className="hover:text-rose-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {urlInStockOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                      <span>{t('filters.onlyInStock')}</span>
                      <button onClick={() => updateFilterParam('inStock', false)} className="hover:text-teal-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {urlMinRating && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                      <span>4.8+ {t('filters.ratingBadge')}</span>
                      <button onClick={() => updateFilterParam('rating', '')} className="hover:text-amber-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleClearAllFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto cursor-pointer"
                  >
                    {t('filters.clearAllBtn')}
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">{t('filters.errorTitle')}</h3>
                <p className="text-xs text-slate-500 mt-1">{t('filters.errorDesc')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-800">{t('filters.noResultsTitle')}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {t('filters.noResultsDesc')}
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition"
                >
                  {t('filters.clearAllFiltersBtn')}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, products.length)} / {products.length} {t('common.productsCount')}
                    </p>

                    <div className="flex items-center gap-1.5 self-center">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        aria-label={t('catalog.pagination.prev')}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                                currentPage === pageNum
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return <span key={pageNum} className="text-slate-400 px-1">...</span>;
                        }
                        return null;
                      })}

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        aria-label={t('catalog.pagination.next')}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500 font-medium">{t('filters.perPage')}</span>
                      {[16, 24, 36, 48].map(size => (
                        <button
                          key={size}
                          onClick={() => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold transition text-xs cursor-pointer ${
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
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FILTER DRAWER MODAL */}
      {/* ========================================================================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-slide-left z-10">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span>{t('filters.title')}</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category Selection */}
              <div className="mb-5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  {t('filters.categories')}
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      handleCategorySelect('all');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>⚡ {t('filters.allGoods')}</span>
                    <span>{categoryCounts.all || 0}</span>
                  </button>

                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategorySelect(cat.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{CATEGORY_ICONS_MAP[cat.id]} {getCategoryName(cat)}</span>
                      <span>{categoryCounts[cat.id] || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="mb-5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  {t('filters.priceRange')}
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    placeholder={t('filters.from')}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                    className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200"
                  />
                  <input
                    type="number"
                    placeholder={t('filters.to')}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                    className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Mobile Special Offers */}
              <div className="mb-5 pt-3 border-t border-slate-100 space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>🔥 {t('filters.onlyDiscounted')}</span>
                  <input
                    type="checkbox"
                    checked={urlDiscountOnly}
                    onChange={(e) => updateFilterParam('discount', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>📦 {t('filters.onlyInStock')}</span>
                  <input
                    type="checkbox"
                    checked={urlInStockOnly}
                    onChange={(e) => updateFilterParam('inStock', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  handleClearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                {t('filters.clearAll')}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApplyPriceFilter();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
              >
                {t('filters.showResults')} ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}

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
