import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/common/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { CatalogPage } from './pages/shop/CatalogPage';
import { MyOrdersPage } from './pages/shop/MyOrdersPage';
import { CallCenterOrdersPage } from './pages/callcenter/CallCenterOrdersPage';
import { ManagerInventoryPage } from './pages/manager/ManagerInventoryPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Shop Catalog */}
          <Route path="/" element={<CatalogPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
    </div>
  );
}

export default App;
