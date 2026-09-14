import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi, productsApi, usersApi } from '../../api/client';
import { formatCurrency, formatUZS, formatDate, ORDER_STATUSES } from '../../utils/formatters';
import { MetricsSkeleton } from '../../components/common/SkeletonLoader';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders', 'admin-metrics'],
    queryFn: () => ordersApi.getAll(),
  });

  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', 'admin-metrics'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['users', 'admin-metrics'],
    queryFn: () => usersApi.getAll(),
  });

  const isLoading = isOrdersLoading || isProductsLoading || isUsersLoading;

  // Analytics Computations
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const activeOrdersCount = orders.filter(o => ['Pending', 'Confirmed', 'Shipped'].includes(o.status)).length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Status distribution
  const statusStats = {
    Pending: orders.filter(o => o.status === 'Pending').length,
    Confirmed: orders.filter(o => o.status === 'Confirmed').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  // Recent 5 orders
  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-800 text-xs font-bold mb-2 border border-rose-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Administrator Paneli (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Platforma Analitikasi & Monitoring</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Savdo ko'rsatkichlari, tushum, faol buyurtmalar va tizim resurslari balansi.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
        >
          <Users className="w-4 h-4 text-rose-400" />
          <span>Foydalanuvchilar & Rollar Boshqaruvi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <MetricsSkeleton />
      ) : (
        <>
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Revenue */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Umumiy Tushum</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalRevenue)}</h3>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">≈ {formatUZS(totalRevenue)}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% o'tgan haftaga nisbatan</span>
              </div>
            </div>

            {/* Active Orders */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Faol Buyurtmalar</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{activeOrdersCount} ta</h3>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Jami: {orders.length} ta buyurtma</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                Yetkazilgan: <strong className="text-slate-800">{deliveredOrdersCount} ta</strong> ({Math.round((deliveredOrdersCount / (orders.length || 1)) * 100)}%)
              </div>
            </div>

            {/* Average Order Value */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500">O'rtacha Chek</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(avgOrderValue)}</h3>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Har bir buyurtmaga</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-blue-600 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Mijozlar savatcha o'rtacha qiymati</span>
              </div>
            </div>

            {/* Total Users */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Ro'yxatdan O'tganlar</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{users.length} nafar</h3>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Xaridorlar & Xodimlar</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-rose-600 font-semibold">
                Multi-role RBAC himoyasi ostida
              </div>
            </div>
          </div>

          {/* Charts & Analytics Visuals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Sales Dynamics Visual Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-900">Sotuvlar Dinamikasi (Haftalik Tushum)</h3>
                  <p className="text-xs text-slate-400">So'nggi 7 kunlik tushum taqsimoti ($)</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Faol o'sishda
                </span>
              </div>

              {/* Responsive SVG Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-3 pt-4 px-2">
                {[
                  { day: 'Dush', val: 1200, height: '40%' },
                  { day: 'Sesh', val: 2400, height: '65%' },
                  { day: 'Chor', val: 1800, height: '50%' },
                  { day: 'Pay', val: 3200, height: '85%' },
                  { day: 'Jum', val: 2900, height: '75%' },
                  { day: 'Shan', val: 4100, height: '95%' },
                  { day: 'Yak', val: 3600, height: '88%' },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${bar.val}
                    </div>
                    <div
                      style={{ height: bar.height }}
                      className="w-full rounded-xl bg-gradient-to-t from-brand-600 to-emerald-400 group-hover:brightness-110 transition-all duration-300 shadow-sm"
                    ></div>
                    <span className="text-[11px] font-bold text-slate-500">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Status Distribution */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 mb-1">Buyurtmalar Taqsimoti</h3>
                <p className="text-xs text-slate-400 mb-5">Statuslar bo'yicha ulush</p>

                <div className="space-y-3">
                  {[
                    { key: 'Pending', label: 'Kutilmoqda', count: statusStats.Pending, color: 'bg-amber-500', text: 'text-amber-700' },
                    { key: 'Confirmed', label: 'Tasdiqlandi', count: statusStats.Confirmed, color: 'bg-blue-500', text: 'text-blue-700' },
                    { key: 'Shipped', label: "Yo'lda", count: statusStats.Shipped, color: 'bg-purple-500', text: 'text-purple-700' },
                    { key: 'Delivered', label: 'Yetkazildi', count: statusStats.Delivered, color: 'bg-emerald-500', text: 'text-emerald-700' },
                    { key: 'Cancelled', label: 'Bekor qilindi', count: statusStats.Cancelled, color: 'bg-rose-500', text: 'text-rose-700' },
                  ].map(st => {
                    const pct = Math.round((st.count / (orders.length || 1)) * 100);
                    return (
                      <div key={st.key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700">{st.label}</span>
                          <span className="font-bold text-slate-900">{st.count} ta ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${st.color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Jami aylanma:</span>
                <strong className="text-slate-900 text-xs">{orders.length} ta buyurtma</strong>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">So'nggi Kelib Tushgan Buyurtmalar</h3>
                <p className="text-xs text-slate-400">Real vaqt monitoringi</p>
              </div>
              <Link
                to="/callcenter"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Barchasini ko'rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-2">ID</th>
                    <th className="py-2.5 px-2">Mijoz</th>
                    <th className="py-2.5 px-2">Sana</th>
                    <th className="py-2.5 px-2">Summa</th>
                    <th className="py-2.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {recentOrders.map(order => {
                    const st = ORDER_STATUSES[order.status] || ORDER_STATUSES.Pending;
                    return (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="py-3 px-2 font-bold text-slate-900">#{order.id}</td>
                        <td className="py-3 px-2 text-slate-800">{order.customerInfo?.name}</td>
                        <td className="py-3 px-2 text-slate-500">{formatDate(order.createdAt)}</td>
                        <td className="py-3 px-2 font-black text-slate-900">{formatCurrency(order.totalAmount)}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.badgeClass}`}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
