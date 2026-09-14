import { INITIAL_DATA } from './initialData';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = 'http://localhost:5001';
const STORAGE_KEY = 'uzshop_database';

// Initialize resilient localStorage database
const getLocalDb = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage DB:', err);
    return INITIAL_DATA;
  }
};

const saveLocalDb = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving localStorage DB:', err);
  }
};

// Helper for HTTP requests with Authorization Header and graceful fallback
async function request(endpoint, options = {}) {
  const token = useAuthStore.getState().token;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout for json-server check

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (err) {
    // If json-server is offline or network error, return null to trigger fallback
    return null;
  }
}

// ---------------- AUTH API ----------------
export const authApi = {
  async login({ email, password }) {
    const serverUsers = await request('/users');
    const localDb = getLocalDb();
    const users = Array.isArray(serverUsers) ? serverUsers : localDb.users;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Email yoki parol noto'g'ri kiritildi");
    }

    const { password: _, ...cleanUser } = user;
    return {
      user: cleanUser,
      token: `mock-jwt-token-${user.id}-${Date.now()}`
    };
  },

  async register({ name, email, password, phone }) {
    // 1. Email mavjudligini tekshirish
    const serverUsers = await request('/users');
    const localDb = getLocalDb();
    const users = Array.isArray(serverUsers) ? serverUsers : localDb.users;

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Ushbu email allaqachon ro'yxatdan o'tgan");
    }

    const payload = {
      name,
      email,
      password: password || 'password123',
      role: 'User',
      phone: phone || '+998900000000'
    };

    // 2. To'g'ridan-to'g'ri json-server'ga POST /users orqali yozamiz (db.json ga tushadi!)
    const serverResult = await request('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const finalUser = serverResult || { ...payload, id: String(Date.now()) };

    // 3. localStorage ni ham yangilab qo'yamiz
    localDb.users.push(finalUser);
    saveLocalDb(localDb);

    const { password: _, ...cleanUser } = finalUser;
    return {
      user: cleanUser,
      token: `mock-jwt-token-${finalUser.id}-${Date.now()}`
    };
  }
};

// ---------------- PRODUCTS API ----------------
export const productsApi = {
  async getAll({ categoryId, search, sort, minPrice, maxPrice } = {}) {
    const serverResult = await request('/products');
    let products = [];

    if (serverResult && Array.isArray(serverResult)) {
      products = serverResult;
      const db = getLocalDb();
      db.products = serverResult;
      saveLocalDb(db);
    } else {
      products = getLocalDb().products;
    }

    if (categoryId && categoryId !== 'all') {
      products = products.filter(p => p.categoryId === categoryId);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice !== undefined && minPrice !== '') {
      products = products.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      products = products.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
    }

    if (sort === 'price-asc') {
      products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === 'price-desc') {
      products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sort === 'popular') {
      products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    } else if (sort === 'rating') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return products;
  },

  async getById(id) {
    const serverResult = await request(`/products/${id}`);
    if (serverResult) return serverResult;

    const db = getLocalDb();
    return db.products.find(p => String(p.id) === String(id)) || null;
  },

  async create(productData) {
    const tempId = `prod-${Date.now().toString().slice(-4)}`;
    const newProduct = {
      ...productData,
      id: tempId,
      rating: productData.rating || 5.0,
      salesCount: 0,
      price: Number(productData.price),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
      stock: Number(productData.stock) || 0,
    };

    const serverResult = await request('/products', {
      method: 'POST',
      body: JSON.stringify(newProduct)
    });

    const finalProduct = serverResult || newProduct;
    const db = getLocalDb();
    db.products.unshift(finalProduct);
    saveLocalDb(db);
    return finalProduct;
  },

  async update(id, updatedData) {
    const payload = {
      ...updatedData,
      price: Number(updatedData.price),
      discountPrice: updatedData.discountPrice ? Number(updatedData.discountPrice) : null,
      stock: Number(updatedData.stock),
    };

    const serverResult = await request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    const db = getLocalDb();
    const index = db.products.findIndex(p => String(p.id) === String(id));
    const finalProduct = serverResult || { ...(index > -1 ? db.products[index] : {}), ...payload };
    if (index > -1) {
      db.products[index] = finalProduct;
    } else {
      db.products.unshift(finalProduct);
    }
    saveLocalDb(db);
    return finalProduct;
  },

  async updateStock(id, newStock) {
    const stockVal = Math.max(0, Number(newStock));
    const serverResult = await request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock: stockVal })
    });

    const db = getLocalDb();
    const index = db.products.findIndex(p => String(p.id) === String(id));
    if (index > -1) {
      db.products[index].stock = stockVal;
      saveLocalDb(db);
      return db.products[index];
    }
    return serverResult || { id, stock: stockVal };
  },

  async delete(id) {
    await request(`/products/${id}`, {
      method: 'DELETE'
    });

    const db = getLocalDb();
    db.products = db.products.filter(p => String(p.id) !== String(id));
    saveLocalDb(db);
    return { success: true, id };
  }
};

// ---------------- ORDERS API ----------------
export const ordersApi = {
  async getAll({ status, search, userId } = {}) {
    const serverResult = await request('/orders');
    let orders = [];

    if (serverResult && Array.isArray(serverResult)) {
      orders = serverResult;
      // Sync into local DB so local storage always has the latest orders from server
      const db = getLocalDb();
      db.orders = serverResult;
      saveLocalDb(db);
    } else {
      orders = getLocalDb().orders;
    }

    if (userId) {
      orders = orders.filter(o => String(o.userId) === String(userId));
    }

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      orders = orders.filter(o =>
        String(o.id).toLowerCase().includes(q) ||
        o.customerInfo?.name?.toLowerCase().includes(q) ||
        o.customerInfo?.phone?.toLowerCase().includes(q) ||
        o.customerInfo?.address?.toLowerCase().includes(q)
      );
    }

    // Sort by latest createdAt first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return orders;
  },

  async getById(id) {
    const serverResult = await request(`/orders/${id}`);
    if (serverResult) return serverResult;

    const db = getLocalDb();
    return db.orders.find(o => String(o.id) === String(id)) || null;
  },

  async create(orderData) {
    const tempId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      ...orderData,
      id: tempId,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      history: [
        {
          status: 'Pending',
          date: new Date().toISOString(),
          note: 'Buyurtma muvaffaqiyatli qabul qilindi'
        }
      ]
    };

    const serverResult = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(newOrder)
    });

    const finalOrder = serverResult || newOrder;
    const db = getLocalDb();
    db.orders.unshift(finalOrder);

    // Reduce stock for purchased products
    if (orderData.items && Array.isArray(orderData.items)) {
      orderData.items.forEach(item => {
        const prod = db.products.find(p => String(p.id) === String(item.productId));
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          prod.salesCount = (prod.salesCount || 0) + item.quantity;
        }
      });
    }

    saveLocalDb(db);
    return finalOrder;
  },

  async updateStatus(id, newStatus, note = '') {
    const newHistoryItem = {
      status: newStatus,
      date: new Date().toISOString(),
      note: note || `Status o'zgartirildi: ${newStatus}`
    };

    // 1. Try server PATCH first
    const serverOrder = await request(`/orders/${id}`);
    let updatedHistory = [newHistoryItem];
    if (serverOrder && serverOrder.history) {
      updatedHistory = [...serverOrder.history, newHistoryItem];
    }

    const patchResult = await request(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, history: updatedHistory })
    });

    if (patchResult) {
      // Sync into local DB
      const db = getLocalDb();
      const idx = db.orders.findIndex(o => String(o.id) === String(id));
      if (idx > -1) {
        db.orders[idx] = patchResult;
      } else {
        db.orders.unshift(patchResult);
      }
      saveLocalDb(db);
      return patchResult;
    }

    // 2. Fallback to local DB if server is offline
    const db = getLocalDb();
    const orderIndex = db.orders.findIndex(o => String(o.id) === String(id));
    if (orderIndex > -1) {
      const order = db.orders[orderIndex];
      const localHistory = [
        ...(order.history || []),
        newHistoryItem
      ];
      order.status = newStatus;
      order.history = localHistory;
      saveLocalDb(db);
      return order;
    }

    throw new Error("Buyurtma topilmadi");
  }
};

// ---------------- USERS API ----------------
export const usersApi = {
  async getAll() {
    const serverResult = await request('/users');
    let users = [];
    if (serverResult && Array.isArray(serverResult)) {
      users = serverResult;
      const db = getLocalDb();
      db.users = serverResult;
      saveLocalDb(db);
    } else {
      users = getLocalDb().users;
    }
    // Don't leak passwords
    return users.map(({ password: _, ...user }) => user);
  },

  async updateRole(id, newRole) {
    const serverResult = await request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole })
    });

    const db = getLocalDb();
    const index = db.users.findIndex(u => String(u.id) === String(id));
    if (index > -1) {
      db.users[index].role = newRole;
      saveLocalDb(db);
      const { password: _, ...user } = db.users[index];
      return user;
    }
    return serverResult || { id, role: newRole };
  },

  async delete(id) {
    await request(`/users/${id}`, {
      method: 'DELETE'
    });

    const db = getLocalDb();
    db.users = db.users.filter(u => String(u.id) !== String(id));
    saveLocalDb(db);
    return { success: true, id };
  }
};

// ---------------- CATEGORIES API ----------------
export const categoriesApi = {
  async getAll() {
    const serverResult = await request('/categories');
    return serverResult || getLocalDb().categories;
  }
};
