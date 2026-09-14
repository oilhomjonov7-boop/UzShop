import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency, formatUZS } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, getTotalPrice, getTotalCount } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const total = getTotalPrice();
  const count = getTotalCount();

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-slide-up">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-lg">Savatcha ({count})</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">Savatchangiz bo'sh</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
                    Katalogdan o'zingizga ma'qul mahsulotlarni tanlab, savatchaga qo'shishingiz mumkin.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md transition"
                  >
                    Katalogga o'tish
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity }) => {
                  const effectivePrice = product.discountPrice || product.price;
                  const itemTotal = effectivePrice * quantity;
                  const isMaxStock = quantity >= product.stock;

                  return (
                    <div
                      key={product.id}
                      className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h5 className="text-xs font-bold text-slate-900 truncate leading-snug">
                              {product.title}
                            </h5>
                            <button
                              onClick={() => removeItem(product.id)}
                              className="text-slate-400 hover:text-rose-600 transition p-0.5"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-black text-brand-600">
                              {formatCurrency(effectivePrice)}
                            </span>
                            {product.discountPrice && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 text-slate-500 hover:bg-slate-100 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 min-w-[24px] text-center">
                              {quantity}
                            </span>
                            <button
                              disabled={isMaxStock}
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className={`p-1 transition ${
                                isMaxStock ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'
                              }`}
                              title={isMaxStock ? "Ombordagi bor miqdorga yetildi" : "Oshirish"}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900 block">
                              {formatCurrency(itemTotal)}
                            </span>
                            {isMaxStock && (
                              <span className="text-[9px] text-amber-600 font-medium">Maksimal zaxira</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-white space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Mahsulotlar soni:</span>
                    <span className="font-semibold text-slate-800">{count} dona</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Yetkazib berish:</span>
                    <span className="font-semibold text-emerald-600">Bepul (Aksiya)</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-900">Jami summa:</span>
                    <div className="text-right">
                      <span className="text-lg font-black text-brand-600 block">
                        {formatCurrency(total)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        ≈ {formatUZS(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOpenCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition transform active:scale-98"
                >
                  <span>Buyurtma berish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </>
  );
};
