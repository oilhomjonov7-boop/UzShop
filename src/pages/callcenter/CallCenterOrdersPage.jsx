import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../api/client';
import { formatCurrency, formatUZS, formatDate, ORDER_STATUSES } from '../../utils/formatters';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { showToast } from '../../components/common/Toast';
import { handleImageError } from '../../utils/imageFallback';
import {
  Headphones,
  Search,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
  Filter,
  ArrowRight,
  Eye,
  AlertCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const CallCenterOrdersPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Fetch orders with TanStack Query
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['orders', 'operator-view'],
    queryFn: () => ordersApi.getAll(),
    staleTime: 1000 * 20,
  });

  // Mutation to update order status
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status, note }) => ordersApi.updateStatus(orderId, status, note),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showToast.success(
        `Buyurtma #${updatedOrder.id} statusi "${ORDER_STATUSES[updatedOrder.status]?.label}" ga o'zgartirildi`,
        "Status yangilandi"
      );
      if (selectedOrder?.id === updatedOrder.id) {
        setSelectedOrder(updatedOrder);
      }
      setStatusNote('');
    },
    onError: (err) => {
      showToast.error(err.message || "Statusni yangilashda xatolik yuz berdi");
    }
  });

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Metrics counters
  const counts = {
    all: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Confirmed: orders.filter(o => o.status === 'Confirmed').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id?.toLowerCase().includes(q);
        const matchesName = order.customerInfo?.name?.toLowerCase().includes(q);
        const matchesPhone = order.customerInfo?.phone?.toLowerCase().includes(q);
        const matchesAddress = order.customerInfo?.address?.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesPhone && !matchesAddress) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Pagination calculation (Max 12 per page)
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const handleQuickStatusChange = (orderId, newStatus, defaultNote = '') => {
    const note = statusNote || defaultNote || `Operator tomonidan ${ORDER_STATUSES[newStatus]?.label} holatiga o'tkazildi`;
    updateStatusMutation.mutate({ orderId, status: newStatus, note });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2 border border-amber-500/20 dark:border-amber-900/40">
            <Headphones className="w-3.5 h-3.5" />
            <span>Call Center & Operator Moduli (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Buyurtmalar Oqimi & Boshqaruvi</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelib tushgan yangi buyurtmalarni ko'rib chiqing, mijozlar bilan bog'laning va statusni yangilang.
          </p>
        </div>

        {/* Live Pending Pulse Badge (Only show when there are pending orders) */}
        {counts.Pending > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 animate-fade-in">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
            <div className="text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Tasdiqlash kutilmoqda: </span>
              <strong className="text-amber-800 dark:text-amber-300 font-black text-sm">{counts.Pending} ta buyurtma</strong>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { key: 'all', label: 'Barcha buyurtmalar', count: counts.all, color: 'text-slate-800 dark:text-slate-200', bg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' },
          { key: 'Pending', label: 'Kutilmoqda', count: counts.Pending, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50' },
          { key: 'Confirmed', label: 'Tasdiqlandi', count: counts.Confirmed, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50' },
          { key: 'Shipped', label: "Yo'lda", count: counts.Shipped, color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50' },
          { key: 'Delivered', label: 'Yetkazildi', count: counts.Delivered, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50' },
          { key: 'Cancelled', label: 'Bekor qilindi', count: counts.Cancelled, color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
              statusFilter === item.key
                ? 'ring-2 ring-slate-900 dark:ring-amber-400 shadow-md ' + item.bg
                : 'hover:border-slate-300 dark:hover:border-slate-700 ' + item.bg
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">{item.label}</span>
            <span className={`text-xl font-black block mt-1 ${item.color}`}>{item.count}</span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="ID, mijoz ismi yoki telefon raqami..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium self-end sm:self-center">
          Topilgan buyurtmalar: <strong className="text-slate-800 dark:text-white">{filteredOrders.length} ta</strong>
          {totalPages > 1 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold border border-amber-200/60 dark:border-amber-900/40">
              {currentPage} / {totalPages}-sahifa
            </span>
          )}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : isError ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Buyurtmalar ro'yxatini yuklab bo'lmadi</h3>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Ushbu parametrlar bo'yicha buyurtma topilmadi</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Status yoki qidiruv so'zini tozalab ko'ring.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4">Buyurtma ID & Sana</th>
                  <th className="py-4 px-4">Mijoz & Aloqa</th>
                  <th className="py-4 px-4">Tovarlar</th>
                  <th className="py-4 px-4">Summa</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {paginatedOrders.map((order) => {
                  const statusConfig = ORDER_STATUSES[order.status] || ORDER_STATUSES.Pending;
                  const isMutating = updateStatusMutation.isPending;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      {/* ID & Date */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">#{order.id}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">{formatDate(order.createdAt)}</span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{order.customerInfo?.name}</span>
                        <a
                          href={`tel:${order.customerInfo?.phone}`}
                          className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium text-[11px] mt-0.5 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{order.customerInfo?.phone}</span>
                        </a>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate max-w-[180px]">
                          {order.customerInfo?.address}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-[200px]">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="truncate text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                              {item.quantity}× {item.title}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <span className="font-black text-slate-900 dark:text-white block">{formatCurrency(order.totalAmount)}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{order.paymentMethod}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`}></span>
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick transitions based on current status */}
                          {order.status === 'Pending' && (
                            <>
                              <button
                                disabled={isMutating}
                                onClick={() => handleQuickStatusChange(order.id, 'Confirmed', 'Mijoz bilan bogʻlanib tasdiqlandi')}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition shadow-sm cursor-pointer"
                                title="Buyurtmani tasdiqlash"
                              >
                                Tasdiqlash
                              </button>
                              <button
                                disabled={isMutating}
                                onClick={() => handleQuickStatusChange(order.id, 'Cancelled', 'Operator tomonidan bekor qilindi')}
                                className="px-2 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 font-bold text-[11px] transition border border-rose-200 dark:border-rose-900/50 cursor-pointer"
                                title="Bekor qilish"
                              >
                                Bekor
                              </button>
                            </>
                          )}

                          {order.status === 'Confirmed' && (
                            <button
                              disabled={isMutating}
                              onClick={() => handleQuickStatusChange(order.id, 'Shipped', 'Kuryerga yetkazish uchun topshirildi')}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition shadow-sm cursor-pointer"
                            >
                              Yetkazishga jo'natish
                            </button>
                          )}

                          {order.status === 'Shipped' && (
                            <button
                              disabled={isMutating}
                              onClick={() => handleQuickStatusChange(order.id, 'Delivered', 'Mijozga muvaffaqiyatli yetkazildi')}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-sm cursor-pointer"
                            >
                              Yetkazildi deb belgilash
                            </button>
                          )}

                          {/* Detail Modal button */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Batafsil ko'rish"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Bar */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Jami <strong className="text-slate-900 dark:text-white font-bold">{filteredOrders.length}</strong> tadan{' '}
                {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} ko'rsatilmoqda
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
                  title="Oldingi sahifa"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  // If many pages, show window
                  if (totalPages > 7) {
                    if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return <span key={pageNum} className="px-1 text-xs text-slate-400">...</span>;
                      }
                      return null;
                    }
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[36px] h-9 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
                  title="Keyingi sahifa"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Detail & Status Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 z-10 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Buyurtma #{selectedOrder.id} Tafsilotlari</h3>
                <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customer card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2 text-xs mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Mijoz:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedOrder.customerInfo?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Telefon:</span>
                <a
                  href={`tel:${selectedOrder.customerInfo?.phone}`}
                  className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedOrder.customerInfo?.phone}</span>
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Manzil:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{selectedOrder.customerInfo?.address}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">To'lov:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedOrder.paymentMethod} • {formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Buyurtma tarkibi:</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => handleImageError(e, item.title)}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.quantity} dona × {formatCurrency(item.price)}</p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">{formatCurrency(item.quantity * item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifecycle Status Changer */}
            <div className="p-4 bg-amber-50/50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/50 mb-4">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2">Buyurtma Statusini O'zgartirish:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleQuickStatusChange(selectedOrder.id, st)}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition cursor-pointer ${
                      selectedOrder.status === st
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    {ORDER_STATUSES[st]?.label || st}
                  </button>
                ))}
              </div>
            </div>

            {/* History log */}
            {selectedOrder.history && selectedOrder.history.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Tarix va Harakatlar:</h4>
                <div className="space-y-1.5 text-xs text-slate-500">
                  {selectedOrder.history.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{h.status}: </span>
                        <span className="text-slate-600 dark:text-slate-300">{h.note}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{formatDate(h.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
