import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../../api/client';
import { formatCurrency, formatUZS } from '../../utils/formatters';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { showToast } from '../../components/common/Toast';
import {
  Boxes,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  X,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Layers
} from 'lucide-react';

export const ManagerInventoryPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, out, low
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    categoryId: 'cat-1',
    price: '',
    discountPrice: '',
    stock: '',
    image: '',
    description: ''
  });

  // Fetch Products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'manager-inventory'],
    queryFn: () => productsApi.getAll(),
    staleTime: 1000 * 20,
  });

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  // Create Product Mutation
  const createMutation = useMutation({
    mutationFn: (newProd) => productsApi.create(newProd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast.success("Yangi mahsulot muvaffaqiyatli qo'shildi!");
      handleCloseModal();
    },
    onError: (err) => showToast.error(err.message || "Xatolik yuz berdi")
  });

  // Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast.success("Mahsulot ma'lumotlari yangilandi!");
      handleCloseModal();
    },
    onError: (err) => showToast.error(err.message || "Xatolik yuz berdi")
  });

  // Update Stock Inline Mutation
  const stockMutation = useMutation({
    mutationFn: ({ id, stock }) => productsApi.updateStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast.success("Zaxira (stock) yangilandi");
    },
    onError: (err) => showToast.error(err.message || "Xatolik yuz berdi")
  });

  // Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast.success("Mahsulot o'chirildi");
      setDeleteConfirmId(null);
    },
    onError: (err) => showToast.error(err.message || "Xatolik yuz berdi")
  });

  // Filtered Products
  const filteredProducts = products.filter(prod => {
    if (selectedCategory !== 'all' && prod.categoryId !== selectedCategory) return false;
    if (stockFilter === 'out' && prod.stock > 0) return false;
    if (stockFilter === 'low' && (prod.stock === 0 || prod.stock > 5)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return prod.title.toLowerCase().includes(q) || prod.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Stats
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      categoryId: categories[0]?.id || 'cat-1',
      price: '',
      discountPrice: '',
      stock: '10',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      categoryId: product.categoryId,
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      image: product.image,
      description: product.description
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || formData.stock === '') {
      showToast.error("Iltimos, zarur maydonlarni to'ldiring");
      return;
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleStockChange = (productId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    stockMutation.mutate({ id: productId, stock: newStock });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-800 text-xs font-bold mb-2 border border-indigo-500/20">
            <Boxes className="w-3.5 h-3.5" />
            <span>Manager Moduli (Mahsulotlar & Ombor)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Mahsulotlar & Zaxira Boshqaruvi</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Yangi mahsulotlarni qo'shing, narxlarni va ombor qoldiqlarini (Stock) tahrirlang.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Mahsulot Qo'shish</span>
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Jami mahsulotlar:</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{products.length} ta</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setStockFilter(stockFilter === 'low' ? 'all' : 'low')}
          className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition ${
            stockFilter === 'low' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400' : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div>
            <span className="text-xs text-amber-700 font-medium">Kam qolgan (≤5 dona):</span>
            <h3 className="text-2xl font-black text-amber-800 mt-0.5">{lowStockCount} ta</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setStockFilter(stockFilter === 'out' ? 'all' : 'out')}
          className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition ${
            stockFilter === 'out' ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400' : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div>
            <span className="text-xs text-rose-700 font-medium">Sotuvda tugagan (0 dona):</span>
            <h3 className="text-2xl font-black text-rose-800 mt-0.5">{outOfStockCount} ta</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Mahsulot nomi bo'yicha qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Barcha kategoriyalar
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Inventory Table */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Hech qanday mahsulot topilmadi</h3>
          <p className="text-xs text-slate-500 mt-1">Filtr yoki qidiruv so'zini o'zgartirib ko'ring.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-4">Mahsulot</th>
                  <th className="py-4 px-4">Kategoriya</th>
                  <th className="py-4 px-4">Asosiy Narx</th>
                  <th className="py-4 px-4">Chegirmali Narx</th>
                  <th className="py-4 px-4">Ombor Zaxirasi (Stock)</th>
                  <th className="py-4 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((product) => {
                  const cat = categories.find(c => c.id === product.categoryId);
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition">
                      {/* Product Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">{product.title}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {cat?.name || product.categoryId}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{formatCurrency(product.price)}</span>
                      </td>

                      {/* Discount Price */}
                      <td className="py-3 px-4">
                        {product.discountPrice ? (
                          <div>
                            <span className="font-bold text-brand-600">{formatCurrency(product.discountPrice)}</span>
                            <span className="text-[10px] text-rose-500 font-bold block">
                              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Chegirma yo'q</span>
                        )}
                      </td>

                      {/* Stock Adjuster */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                            <button
                              onClick={() => handleStockChange(product.id, product.stock, -1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition"
                              title="1 taga kamaytirish"
                            >
                              -
                            </button>
                            <span className="px-3 font-bold text-slate-900 min-w-[32px] text-center">
                              {product.stock}
                            </span>
                            <button
                              onClick={() => handleStockChange(product.id, product.stock, 1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition"
                              title="1 taga oshirish"
                            >
                              +
                            </button>
                          </div>

                          {/* Stock Status Badge */}
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200">
                              Sotuvda yo'q
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                              Kam qoldi
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              Yetarli
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteConfirmId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 z-10 animate-slide-up text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Mahsulotni o'chirmoqchimisiz?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">Ushbu amal qaytarilmaydi.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 shadow-md"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleCloseModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 z-10 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}
              </h3>
              <button onClick={handleCloseModal} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mahsulot Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: iPhone 15 Pro Max"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategoriya *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ombor Zaxirasi (Stock) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Price & Discount Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asosiy Narx ($) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="1200"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chegirmali Narx ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1100"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rasm Havolasi (Image URL) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tavsif *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mahsulot haqida to'liq texnik ma'lumot..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {editingProduct ? "O'zgarishlarni saqlash" : "Mahsulotni yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
