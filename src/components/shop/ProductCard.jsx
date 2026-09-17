import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { formatCurrency, formatUZS } from '../../utils/formatters';
import { ShoppingCart, Star, Check, AlertCircle, Heart, Zap } from 'lucide-react';
import { showToast } from '../common/Toast';
import { handleImageError } from '../../utils/imageFallback';
import { useTranslation } from '../../utils/useTranslation';

export const ProductCard = ({ product, onSelect }) => {
  const { t } = useTranslation();
  const { addItem, items } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const isLiked = isWishlisted(product.id);
  const isOutOfStock = product.stock <= 0;

  // Check if item is already in cart and at max stock
  const inCart = items.find(i => i.product.id === product.id);
  const cartQty = inCart ? inCart.quantity : 0;
  const isMaxReached = cartQty >= product.stock;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      showToast.error(t('product.notAvailable'));
      return;
    }
    if (isMaxReached) {
      showToast.info(`${t('product.maxInCart')} (${product.stock})`);
      return;
    }

    const added = addItem(product, 1);
    if (added) {
      showToast.success(`"${product.title}" ${t('product.addedToast')}`);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    if (added) {
      showToast.success(`"${product.title}" ${t('product.wishlistAddedToast')}`);
    } else {
      showToast.info(`"${product.title}" ${t('product.wishlistRemovedToast')}`);
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  // Monthly installment calculation (Uzum Nasiya 12 oy)
  const monthlyUZS = Math.round(((product.discountPrice || product.price) / 12));

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative p-2.5 sm:p-3"
    >
      {/* Top Image Showcase with Badges & Wishlist Heart */}
      <div className="relative w-full aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden mb-2">
        {/* Floating Badges (Top-Left) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {discountPercent && (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black tracking-tight shadow-xs">
              -{discountPercent}%
            </span>
          )}

          <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold tracking-tight shadow-xs flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 fill-white" />
            <span>{t('product.oneDay')}</span>
          </span>

          {isOutOfStock ? (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-900/90 text-white text-[9px] font-bold tracking-tight shadow-xs flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
              <span>{t('product.outOfStock')}</span>
            </span>
          ) : product.stock <= 5 ? (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold tracking-tight shadow-xs">
              {product.stock} {t('product.leftInStock')}
            </span>
          ) : null}
        </div>

        {/* Favorite / Wishlist Heart Button (Top-Right) */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-white/60 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-110 active:scale-90"
          title={isLiked ? t('product.removeFromWishlist') : t('product.addToWishlist')}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Main Product Image */}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => handleImageError(e, product.title)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Rating & Review Count (Bottom-Left of Image) */}
        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md border border-slate-200/80 text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-xs">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating || 4.9}</span>
          <span className="text-slate-400 font-normal">({product.salesCount || 14})</span>
        </div>
      </div>

      {/* Product Body Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Title (2-Lines Max, clean typography) */}
          <h3 className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition min-h-[2rem] sm:min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Uzum Market Signature Monthly Installment Pill */}
          <div className="mt-1 mb-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-100/90 text-amber-950 border border-amber-200/70 text-[10px] sm:text-[11px] font-bold leading-none">
              {formatUZS(monthlyUZS)}{t('common.perMonth')}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            {product.discountPrice && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 line-through leading-none block">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-sm sm:text-base font-black text-slate-900 leading-tight block">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block truncate max-w-[120px] sm:max-w-[140px]">
              ≈ {formatUZS(product.discountPrice || product.price)}
            </span>
          </div>

          {/* Uzum-Style Round Cart Action Button */}
          <button
            type="button"
            disabled={isOutOfStock || isMaxReached}
            onClick={handleAddToCart}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                : inCart
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-200 font-bold'
                : 'bg-white hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200 hover:border-emerald-600 shadow-xs hover:scale-105 active:scale-95'
            }`}
            title={
              isOutOfStock
                ? t('product.notAvailable')
                : isMaxReached
                ? `${t('product.maxInCart')} (${product.stock})`
                : inCart
                ? `${t('product.inCart')}: ${cartQty}`
                : t('product.addToCart')
            }
          >
            {inCart ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
