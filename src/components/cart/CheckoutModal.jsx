import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ordersApi } from '../../api/client';
import { formatCurrency, formatUZS } from '../../utils/formatters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../common/Toast';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../utils/useTranslation';
import {
  X,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Package,
  ShieldCheck,
  ArrowRight,
  Lock
} from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { items, getTotalPrice, clearCart, setIsCartOpen } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '+998',
    address: '',
    paymentMethod: 'Payme',
    note: ''
  });

  const [createdOrder, setCreatedOrder] = useState(null);

  const total = getTotalPrice();

  const orderMutation = useMutation({
    mutationFn: (newOrder) => ordersApi.create(newOrder),
    onSuccess: (data) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback if canvas-confetti is not rendered
      }

      clearCart();
      setCreatedOrder(data);
      showToast.success("Buyurtmangiz muvaffaqiyatli rasmiylashtirildi!", "Tabriklaymiz!");
    },
    onError: (err) => {
      showToast.error(err.message || "Buyurtma berishda xatolik yuz berdi");
    }
  });

  if (!isOpen) return null;

  if (!isAuthenticated || !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />
        <div className="relative bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 z-10 animate-slide-up space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">{t('auth.authRequiredTitle')}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{t('auth.authRequiredDesc')}</p>
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                setIsCartOpen(false);
                navigate('/login');
              }}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              {t('auth.loginBtn')}
            </button>
            <button
              onClick={() => {
                onClose();
                setIsCartOpen(false);
                navigate('/register');
              }}
              className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              {t('auth.registerBtn')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    const orderPayload = {
      userId: user.id,
      items: items.map(i => ({
        productId: i.product.id,
        title: i.product.title,
        quantity: i.quantity,
        price: i.product.discountPrice || i.product.price,
        image: i.product.image
      })),
      totalAmount: total,
      paymentMethod: formData.paymentMethod,
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        note: formData.note
      }
    };

    orderMutation.mutate(orderPayload);
  };

  const handleGoToOrders = () => {
    onClose();
    setIsCartOpen(false);
    navigate('/my-orders');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {createdOrder ? "Buyurtma Qabul Qilindi!" : "Buyurtmani Rasmiylashtirish"}
            </h3>
            <p className="text-xs text-slate-500">
              {createdOrder ? "Tez orada operatorimiz siz bilan bog'lanadi" : "Yetkazib berish ma'lumotlarini kiriting"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {createdOrder ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">Buyurtma Raqami: #{createdOrder.id}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Buyurtma holati: <span className="font-semibold text-amber-600">Pending (Kutilmoqda)</span>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Qabul qiluvchi:</span>
                  <span className="font-semibold text-slate-900">{createdOrder.customerInfo?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telefon:</span>
                  <span className="font-semibold text-slate-900">{createdOrder.customerInfo?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Manzil:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[200px]">{createdOrder.customerInfo?.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">To'lov turi:</span>
                  <span className="font-semibold text-brand-600">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-800">Jami to'lov:</span>
                  <span className="font-black text-brand-600">{formatCurrency(createdOrder.totalAmount)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleGoToOrders}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Mening buyurtmalarimga o'tish</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setIsCartOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                >
                  Xaridni davom ettirish
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ism va Familiya *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Ali Valiyev"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Telefon raqami *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Yetkazib berish manzili *</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Shahar, tuman, ko'cha, uy va xonadon raqami"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  To'lov usulini tanlang:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'Payme', icon: CreditCard, color: 'text-cyan-600' },
                    { id: 'Click', icon: CreditCard, color: 'text-blue-600' },
                    { id: 'Naqd pul', icon: Banknote, color: 'text-emerald-600' }
                  ].map(({ id, icon: Icon, color }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: id })}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        formData.paymentMethod === id
                          ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20 text-brand-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span className="text-xs">{id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order summary info */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs mt-2">
                <div>
                  <span className="text-slate-500">Jami ({items.length} turdagi tovar):</span>
                  <span className="block font-bold text-slate-800 mt-0.5">Bepul tezkor yetkazib berish</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-brand-600 block">{formatCurrency(total)}</span>
                  <span className="text-[10px] text-slate-400">≈ {formatUZS(total)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={orderMutation.isPending}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {orderMutation.isPending ? (
                  <span>Rasmiylashtirilmoqda...</span>
                ) : (
                  <>
                    <span>Buyurtmani Tasdiqlash</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
