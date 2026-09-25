import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency, formatUZS, formatDate, ORDER_STATUSES } from '../../utils/formatters';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { handleImageError } from '../../utils/imageFallback';
import { useTranslation } from '../../utils/useTranslation';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  AlertCircle,
  XCircle,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyOrdersPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const TIMELINE_STEPS = [
    { key: 'Pending', label: t('orders.steps.pending'), icon: Clock },
    { key: 'Confirmed', label: t('orders.steps.confirmed'), icon: CheckCircle2 },
    { key: 'Shipped', label: t('orders.steps.shipped'), icon: Truck },
    { key: 'Delivered', label: t('orders.steps.delivered'), icon: Package },
  ];

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return t('orders.steps.pending');
      case 'Confirmed': return t('orders.steps.confirmed');
      case 'Shipped': return t('orders.steps.shipped');
      case 'Delivered': return t('orders.steps.delivered');
      case 'Cancelled': return t('orders.steps.cancelled');
      default: return status;
    }
  };

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['orders', 'my-orders', user?.id],
    queryFn: () => ordersApi.getAll({ userId: user?.id }),
    staleTime: 1000 * 30, // 30s
  });

  const getStepProgress = (status) => {
    if (status === 'Cancelled') return -1;
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('orders.title')}</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('orders.desc')}
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : isError ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Xatolik yuz berdi</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Iltimos, qayta urinib ko'ring.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('orders.emptyTitle')}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {t('orders.emptyDesc')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('orders.goToCatalog')}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = ORDER_STATUSES[order.status] || ORDER_STATUSES.Pending;
            const currentStepIdx = getStepProgress(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition"
              >
                {/* Order Top Bar */}
                <div className="p-5 bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('orders.orderNo')} #{order.id}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`}></span>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                        {t('orders.datePlaced')} {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">{t('orders.totalPay')}</span>
                    <span className="text-base font-black text-brand-600 dark:text-brand-400 block">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                      ({order.paymentMethod})
                    </span>
                  </div>
                </div>

                {/* Visual Timeline Stepper */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                    {t('orders.stepperTitle')}
                  </h4>

                  {isCancelled ? (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-2.5 text-rose-700 dark:text-rose-400 text-xs">
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{t('orders.cancelledAlert')}</span>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Stepper Progress Bar */}
                      <div className="grid grid-cols-4 gap-2 relative z-10">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const Icon = step.icon;
                          const isDone = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div key={step.key} className="flex flex-col items-center text-center">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                  isCurrent
                                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950 shadow-md scale-110'
                                    : isDone
                                    ? 'bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span
                                className={`text-[11px] mt-2 font-semibold ${
                                  isCurrent
                                    ? 'text-brand-700 dark:text-brand-400 font-bold'
                                    : isDone
                                    ? 'text-slate-800 dark:text-slate-200'
                                    : 'text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Connecting line */}
                      <div className="absolute top-5 left-12 right-12 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0">
                        <div
                          className="h-full bg-brand-500 transition-all duration-500"
                          style={{ width: `${(currentStepIdx / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items & Customer info */}
                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30 dark:bg-slate-950/40">
                  {/* Items list */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">{t('orders.orderedGoods')}</h5>
                    <div className="space-y-2.5">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80">
                          <img
                            src={item.image}
                            alt={item.title}
                            onError={(e) => handleImageError(e, item.title)}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <h6 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</h6>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {item.quantity} {t('common.itemsCount')} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {formatCurrency(item.quantity * item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">{t('orders.deliveryInfo')}</h5>
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                          <span className="truncate">{order.customerInfo?.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                          <span>{order.customerInfo?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{t('orders.recipient')}: {order.customerInfo?.name}</span>
                        </div>
                      </div>
                    </div>

                    {order.history && order.history.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">So'nggi harakat: </span>
                        {order.history[order.history.length - 1].note} ({formatDate(order.history[order.history.length - 1].date)})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
