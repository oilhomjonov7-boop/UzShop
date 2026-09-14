import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency, formatUZS } from '../../utils/formatters';
import { ShoppingCart, Star, Check, AlertCircle } from 'lucide-react';
import { showToast } from '../common/Toast';

export const ProductCard = ({ product, onSelect }) => {
  const { addItem, items } = useCartStore();
  const isOutOfStock = product.stock <= 0;

  // Check if item is already in cart and at max stock
  const inCart = items.find(i => i.product.id === product.id);
  const cartQty = inCart ? inCart.quantity : 0;
  const isMaxReached = cartQty >= product.stock;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      showToast.error("Kechirasiz, ushbu mahsulot omborda qolmagan");
      return;
    }
    if (isMaxReached) {
      showToast.info(`Ombordagi barcha mavjud tovarlar (${product.stock} ta) savatchangizda`);
      return;
    }

    const added = addItem(product, 1);
    if (added) {
      showToast.success(`"${product.title}" savatchaga qo'shildi!`);
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-brand-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent && (
          <span className="px-2 py-0.5 rounded-lg bg-rose-500 text-white text-[10px] font-extrabold tracking-wide uppercase shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {isOutOfStock ? (
          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-white text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Sotuvda yo'q
          </span>
        ) : product.stock <= 5 ? (
          <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">
            Faqat {product.stock} ta qoldi
          </span>
        ) : null}
      </div>

      {/* Image container */}
      <div className="relative w-full pt-[75%] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating || 4.8}</span>
            <span className="text-[10px] text-slate-400">({product.salesCount || 10}+ sotilgan)</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-brand-600 transition">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900">
                {formatCurrency(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              ≈ {formatUZS(product.discountPrice || product.price)}
            </p>
          </div>

          <button
            disabled={isOutOfStock || isMaxReached}
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl flex items-center justify-center transition shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isMaxReached
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-brand-500/20'
            }`}
            title={isOutOfStock ? "Sotuvda yo'q" : isMaxReached ? "Maksimal savatchada" : "Savatchaga qo'shish"}
          >
            {isMaxReached ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
