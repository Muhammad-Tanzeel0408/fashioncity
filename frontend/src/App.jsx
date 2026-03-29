import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import Home from './pages/Home/Home';
import Category from './pages/Category/Category';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Search from './pages/Search/Search';
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
// Auth & Admin imports will be added when created

import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ProductList from './pages/Admin/ProductList';
import ProductForm from './pages/Admin/ProductForm';
import OrderList from './pages/Admin/OrderList';
import CategoryList from './pages/Admin/CategoryList';
import HeroManager from './pages/Admin/HeroManager';
import ReviewManager from './pages/Admin/ReviewManager';
import ReturnManager from './pages/Admin/ReturnManager';
import { About, Contact, FAQ, PrivacyPolicy } from './pages/Static/StaticPages';
import TermsAndConditions from './pages/Static/TermsAndConditions';
import ShippingAndDelivery from './pages/Static/ShippingAndDelivery';
import TrackOrder from './pages/Static/TrackOrder';
import ReturnAndExchange from './pages/Static/ReturnAndExchange';
import ReturnConfirmation from './pages/Static/ReturnConfirmation';

// Placeholder components for routes we haven't built yet
const Placeholder = ({ title }) => (
  <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
    <h1 className="text-2xl font-bold">{title}</h1>
    <p>Coming Soon</p>
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      <main style={{ minHeight: isAdminRoute ? 'auto' : '60vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:category" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/cart" element={<Placeholder title="Shopping Cart (Use Drawer)" />} />

          {/* Static Pages */}
          <Route path="/pages/about-us" element={<About />} />
          <Route path="/pages/contact" element={<Contact />} />
          <Route path="/pages/faqs" element={<FAQ />} />
          <Route path="/pages/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/pages/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/pages/shipping-and-delivery" element={<ShippingAndDelivery />} />
          <Route path="/orders/track" element={<TrackOrder />} />
          <Route path="/pages/return-and-exchange" element={<ReturnAndExchange />} />
          <Route path="/pages/return-confirmation" element={<ReturnConfirmation />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="reviews" element={<ReviewManager />} />
            <Route path="returns" element={<ReturnManager />} />
          </Route>

          <Route path="*" element={<Placeholder title="404 - Page Not Found" />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
