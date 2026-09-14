import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../../api/client';
import { ProductCard } from '../../components/shop/ProductCard';
import { ProductDetailModal } from '../../components/shop/ProductDetailModal';
import { ProductSkeleton } from '../../components/common/SkeletonLoader';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Cpu,
  ShoppingBag,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const CATEGORY_ICONS = {
  Smartphone: Smartphone,
  Laptop: Laptop,
  Watch: Watch,
  Headphones: Headphones,
  Cpu: Cpu
};

export const CatalogPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Fetch Products using TanStack Query
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategory, debouncedSearch, sortOption, priceRange],
    queryFn: () => productsApi.getAll({
      categoryId: selectedCategory,
      search: debouncedSearch,
      sort: sortOption,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    }),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  // Pagination calculation
  const totalPages = Math.ceil((products?.length || 0) / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedCategory('all');
    setSortOption('default');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== 'all' || debouncedSearch || priceRange.min || priceRange.max || sortOption !== 'default';

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold mb-4 border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yangi Mavsum Texnologiyalari — 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Sifatli Texnika & <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">Kafolatlangan Xarid</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              UzShop orqali eng sara smartfonlar, noutbuklar va gadjetlarni qulay narxlarda xarid qiling. Tezkor yetkazish va professional xizmat.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Search & Filter Bar Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input with Debounce */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Mahsulot nomi yoki tavsifini qidiring..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-slate-50/50 hover:bg-white focus:bg-white"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Filter & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Price inputs */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Narx:</span>
                <input
                  type="number"
                  placeholder="Dan ($)"
                  value={priceRange.min}
                  onChange={(e) => {
                    setPriceRange(p => ({ ...p, min: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-20 sm:w-24 px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Gacha ($)"
                  value={priceRange.max}
                  onChange={(e) => {
                    setPriceRange(p => ({ ...p, max: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-20 sm:w-24 px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              {/* Sorting Select */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                >
                  <option value="default">Saralash: Barchasi</option>
                  <option value="popular">Eng ommabop</option>
                  <option value="rating">Reyting bo'yicha</option>
                  <option value="price-asc">Narx: Arzondan qimmatga</option>
                  <option value="price-desc">Narx: Qimmatdan arzonga</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition border border-rose-200 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tozalash</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-3 border-t border-slate-100 no-scrollbar">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Barcha tovarlar</span>
            </button>

            {categories.map(cat => {
              const Icon = CATEGORY_ICONS[cat.icon] || Cpu;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filter Pills */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Mahsulotlar katalogi</h2>
            <p className="text-xs text-slate-500">
              Jami <span className="font-bold text-slate-800">{products.length}</span> ta mahsulot topildi
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Ma'lumotlarni yuklashda xatolik yuz berdi</h3>
            <p className="text-xs text-slate-500 mt-1">Iltimos, qayta urinib ko'ring yoki sahifani yangilang.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Hech qanday mahsulot topilmadi</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Qidiruv so'zini yoki tanlangan filtrlarni o'zgartirib ko'ring.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-md"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition ${
                        currentPage === pageNum
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
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
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
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
