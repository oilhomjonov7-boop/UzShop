import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../api/client';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { ProductCard } from '../../components/shop/ProductCard';
import { ProductDetailModal } from '../../components/shop/ProductDetailModal';
import { ProductSkeleton } from '../../components/common/SkeletonLoader';
import { showToast } from '../../components/common/Toast';
import { useTranslation } from '../../utils/useTranslation';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Flame
} from 'lucide-react';

export const WishlistPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wishlistIds, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch all products to filter wishlisted ones
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['wishlist-all-products'],
    queryFn: () => productsApi.getAll(),
    staleTime: 1000 * 60 * 2,
  });

  // Filter products that are in the user's wishlist
  const wishlistedProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  // Popular / recommended products to suggest if empty
  const recommendedProducts = allProducts.slice(0, 5);

  const handleAddAllToCart = () => {
    let addedCount = 0;
    wishlistedProducts.forEach(p => {
      if (p.stock > 0) {
        addItem(p, 1);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showToast.success(`${addedCount} ${t('wishlist.addedAllToast')}`);
    } else {
      showToast.info(t('product.maxInCart'));
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t('wishlist.confirmClear'))) {
      clearWishlist();
      showToast.info(t('wishlist.clearedToast'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition font-medium">
            {t('nav.home')}
          </Link>
          <span>/</span>
          <span className="font-bold text-rose-600 dark:text-rose-400">{t('wishlist.breadcrumb')}</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/60 flex-shrink-0">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span>{t('wishlist.title')}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-extrabold border border-rose-200 dark:border-rose-800">
                    {wishlistedProducts.length} {t('wishlist.goodsCount')}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('wishlist.desc')}
                </p>
              </div>
            </div>

            {/* Actions (when wishlist has items) */}
            {wishlistedProducts.length > 0 && (
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('wishlist.addAllToCart')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/40 font-bold text-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  title={t('wishlist.clearAll')}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('wishlist.clearAll')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : wishlistedProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <Heart className="w-10 h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              {t('wishlist.emptyTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              {t('wishlist.emptyDesc')}
            </p>

            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('wishlist.exploreCatalog')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Recommended Products Showcase */}
            {recommendedProducts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {t('wishlist.recommendedGoods')}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {recommendedProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelect={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Wishlist Products Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {wishlistedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
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
