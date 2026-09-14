import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { RoleBadge } from '../auth/RoleBadge';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Boxes,
  Headphones,
  Package,
  Users,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalCount, setIsCartOpen } = useCartStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getTotalCount();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Banner for Authenticated User Context */}
      {isAuthenticated && (
        <div className="bg-slate-900 text-white text-xs py-1.5 px-4 hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tizimga kirgan: <strong>{user.name}</strong> ({user.email})</span>
            <RoleBadge role={user.role} size="sm" />
          </div>

          {user.role === 'Admin' ? (
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/60 transition text-[11px]"
            >
              <Users className="w-3 h-3 text-rose-400" />
              <span>Foydalanuvchilar Rollarini Boshqarish</span>
            </Link>
          ) : (
            <span className="text-[11px] text-slate-400">
              Rollar faqat Administrator tomonidan boshqariladi
            </span>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black tracking-tight text-slate-900">Uz<span className="text-brand-600">Shop</span></span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">v2.0</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block leading-none">Online Savdo & Boshqaruv</p>
            </div>
          </Link>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/') 
                  ? 'text-brand-700 bg-brand-50 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Katalog
            </Link>

            {/* Buyer Links */}
            {isAuthenticated && user.role === 'User' && (
              <Link
                to="/my-orders"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/my-orders') 
                    ? 'text-brand-700 bg-brand-50 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Buyurtmalarim</span>
              </Link>
            )}

            {/* Operator Links */}
            {isAuthenticated && (user.role === 'CallCenter' || user.role === 'Admin') && (
              <Link
                to="/callcenter"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/callcenter') 
                    ? 'text-amber-700 bg-amber-50 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Headphones className="w-4 h-4 text-amber-500" />
                <span>Operator Paneli</span>
              </Link>
            )}

            {/* Manager Links */}
            {isAuthenticated && (user.role === 'Manager' || user.role === 'Admin') && (
              <Link
                to="/manager"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/manager') 
                    ? 'text-indigo-700 bg-indigo-50 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Boxes className="w-4 h-4 text-indigo-500" />
                <span>Ombor & Mahsulotlar</span>
              </Link>
            )}

            {/* Admin Links */}
            {isAuthenticated && user.role === 'Admin' && (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/admin') 
                      ? 'text-rose-700 bg-rose-50 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-rose-500" />
                  <span>Analitika</span>
                </Link>

                <Link
                  to="/admin/users"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/admin/users') 
                      ? 'text-rose-700 bg-rose-50 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-rose-500" />
                  <span>Foydalanuvchilar</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Actions: Cart & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button (Accessible to User or Guests) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center justify-center group"
              title="Savatcha"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-brand-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shadow-md animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2">
                        <RoleBadge role={user.role} size="sm" />
                      </div>
                    </div>

                    <div className="py-1">
                      {user.role === 'User' && (
                        <Link
                          to="/my-orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          <span>Buyurtmalar tarixi</span>
                        </Link>
                      )}

                      {user.role === 'Admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Admin Boshqaruv</span>
                        </Link>
                      )}

                      {user.role === 'Manager' && (
                        <Link
                          to="/manager"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Boxes className="w-4 h-4 text-slate-400" />
                          <span>Mahsulotlar ombori</span>
                        </Link>
                      )}

                      {user.role === 'CallCenter' && (
                        <Link
                          to="/callcenter"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Headphones className="w-4 h-4 text-slate-400" />
                          <span>Operator buyurtmalari</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Tizimdan chiqish</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition shadow-sm"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-slide-up">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Katalog
          </Link>

          {isAuthenticated && user.role === 'User' && (
            <Link
              to="/my-orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Mening buyurtmalarim
            </Link>
          )}

          {isAuthenticated && (user.role === 'CallCenter' || user.role === 'Admin') && (
            <Link
              to="/callcenter"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50"
            >
              Operator Paneli
            </Link>
          )}

          {isAuthenticated && (user.role === 'Manager' || user.role === 'Admin') && (
            <Link
              to="/manager"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Ombor & Mahsulotlar Paneli
            </Link>
          )}

          {isAuthenticated && user.role === 'Admin' && (
            <>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-rose-700 hover:bg-rose-50"
              >
                Admin Analitika
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-rose-700 hover:bg-rose-50"
              >
                Foydalanuvchilar Boshqaruvi
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
