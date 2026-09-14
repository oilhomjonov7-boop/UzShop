// Utility functions for formatting currencies, dates, and order status labels

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatUZS = (usdAmount) => {
  if (!usdAmount) return "0 so'm";
  // 1 USD ~ 12,800 UZS
  const uzs = usdAmount * 12800;
  return new Intl.NumberFormat('uz-UZ').format(uzs) + " so'm";
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const months = [
    'yan', 'fev', 'mar', 'apr', 'may', 'iyn',
    'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'
  ];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}, ${year} ${hours}:${minutes}`;
};

export const ORDER_STATUSES = {
  Pending: {
    key: 'Pending',
    label: 'Kutilmoqda',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    dotClass: 'bg-amber-500',
    step: 1
  },
  Confirmed: {
    key: 'Confirmed',
    label: 'Tasdiqlandi',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    dotClass: 'bg-blue-500',
    step: 2
  },
  Shipped: {
    key: 'Shipped',
    label: "Yo'lda",
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    dotClass: 'bg-purple-500',
    step: 3
  },
  Delivered: {
    key: 'Delivered',
    label: 'Yetkazildi',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dotClass: 'bg-emerald-500',
    step: 4
  },
  Cancelled: {
    key: 'Cancelled',
    label: 'Bekor qilindi',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    dotClass: 'bg-rose-500',
    step: 0
  }
};

export const ROLE_CONFIG = {
  Admin: {
    label: 'Administrator',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    description: "Tizimni to'liq boshqarish va foydalanuvchilar rollari"
  },
  Manager: {
    label: 'Mahsulot Menejeri',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Mahsulotlar CRUD, zaxira (stock) va narxlar'
  },
  CallCenter: {
    label: 'Call Center Operatori',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Buyurtmalar holatini yangilash va mijozlar bilan aloqa'
  },
  User: {
    label: 'Xaridor',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Katalog, savatcha va buyurtma berish'
  }
};
