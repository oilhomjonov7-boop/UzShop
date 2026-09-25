import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency, formatUZS } from '../../utils/formatters';
import { X, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, Check } from 'lucide-react';
import { showToast } from '../common/Toast';
import { handleImageError } from '../../utils/imageFallback';
import { useTranslation } from '../../utils/useTranslation';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { addItem, items } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const inCart = items.find(i => i.product.id === product.id);
  const cartQty = inCart ? inCart.quantity : 0;
  const maxCanAdd = Math.max(0, product.stock - cartQty);

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleAdd = () => {
    if (isOutOfStock) return;
    const added = addItem(product, quantity);
    if (added) {
      showToast.success(`${quantity} ${t('common.itemsCount')} "${product.title}" ${t('product.addedToast')}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 animate-slide-up flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 shadow-sm transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-slate-100 dark:bg-slate-800 relative min-h-[260px] md:min-h-full">
          <img
            src={product.image}
            alt={product.title}
            onError={(e) => handleImageError(e, product.title)}
            className="w-full h-full object-cover"
          />
          {discountPercent && (
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-xl bg-rose-500 text-white text-xs font-extrabold shadow-md">
              {t('catalog.discountOff')} -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{product.rating || 4.9}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">({product.salesCount || 15} {t('catalog.rated')})</span>
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h2>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">≈ {formatUZS(currentPrice)}</p>

            {/* Description */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">{t('product.description')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock status */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{t('product.stockStatus')}</span>
              {isOutOfStock ? (
                <span className="font-bold text-rose-600 dark:text-rose-400">{t('product.outOfStock')}</span>
              ) : (
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  {t('product.inStock')}: {product.stock} {t('common.itemsCount')}
                </span>
              )}
            </div>

            {/* Guarantees */}
            <div className="mt-4 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('product.guarantee24h')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('product.guarantee12m')}</span>
              </div>
            </div>
          </div>

          {/* Action section */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('product.quantity')}</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= maxCanAdd}
                    onClick={() => setQuantity(Math.min(maxCanAdd, quantity + 1))}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <button
              disabled={isOutOfStock || maxCanAdd <= 0}
              onClick={handleAdd}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                isOutOfStock || maxCanAdd <= 0
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isOutOfStock
                  ? t('product.notAvailable')
                  : maxCanAdd <= 0
                  ? t('product.maxInCart')
                  : `${t('product.addToCart')} (${formatCurrency((product.discountPrice || product.price) * quantity)})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
