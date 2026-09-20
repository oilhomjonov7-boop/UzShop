import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/common/Toast';
import { PeriodicAuthReminder } from './components/auth/PeriodicAuthReminder';
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

// Pages
import { CatalogPage } from './pages/shop/CatalogPage';
import { ProductsPage } from './pages/shop/ProductsPage';
import { WishlistPage } from './pages/shop/WishlistPage';
import { MyOrdersPage } from './pages/shop/MyOrdersPage';
import { CallCenterOrdersPage } from './pages/callcenter/CallCenterOrdersPage';
import { ManagerInventoryPage } from './pages/manager/ManagerInventoryPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const { user, isAuthenticated, syncProfile } = useAuthStore();

  // Auto-sync profile with json-server db.json when mounted or user changes
  useEffect(() => {
    if (isAuthenticated && user?.email && syncProfile) {
      syncProfile();
    }
  }, [isAuthenticated, user?.email]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Shop Catalog & Landing */}
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Authentication (Guest Only) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          {/* User / Buyer Protected Route */}
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute allowedRoles={['User', 'Admin']}>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* CallCenter Operator Protected Route */}
          <Route
            path="/callcenter"
            element={
              <ProtectedRoute allowedRoles={['CallCenter', 'Admin']}>
                <CallCenterOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Product Manager Protected Route */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <ManagerInventoryPage />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <ToastContainer />
      <PeriodicAuthReminder />
    </div>
  );
}

export default App;
