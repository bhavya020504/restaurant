import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';

// Customer Pages
import { Home } from '../pages/customer/Home';
import { Menu } from '../pages/customer/Menu';
import { FoodDetails } from '../pages/customer/FoodDetails';
import { Cart } from '../pages/customer/Cart';
import { Checkout } from '../pages/customer/Checkout';
import { OrderSuccess } from '../pages/customer/OrderSuccess';
import { OrderTracking } from '../pages/customer/OrderTracking';
import { Reservation } from '../pages/customer/Reservation';
import { Profile } from '../pages/customer/Profile';
import { Login } from '../pages/customer/Login';
import { Register } from '../pages/customer/Register';

// Admin Pages
import { Dashboard } from '../pages/admin/Dashboard';
import { Orders } from '../pages/admin/Orders';
import { Customers } from '../pages/admin/Customers';
import { Reservations } from '../pages/admin/Reservations';
import { CallHistory } from '../pages/admin/CallHistory';
import { Recordings } from '../pages/admin/Recordings';
import { Transcripts } from '../pages/admin/Transcripts';
import { Summaries } from '../pages/admin/Summaries';
import { Complaints } from '../pages/admin/Complaints';
import { WhatsAppLogs } from '../pages/admin/WhatsAppLogs';
import { EmailLogs } from '../pages/admin/EmailLogs';
import { Analytics } from '../pages/admin/Analytics';
import { MenuManagement } from '../pages/admin/MenuManagement';
import { Settings } from '../pages/admin/Settings';

import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Portal */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin Dashboard */}
      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/reservations" element={<Reservations />} />
          <Route path="/admin/calls" element={<CallHistory />} />
          <Route path="/admin/recordings" element={<Recordings />} />
          <Route path="/admin/transcripts" element={<Transcripts />} />
          <Route path="/admin/summaries" element={<Summaries />} />
          <Route path="/admin/complaints" element={<Complaints />} />
          <Route path="/admin/whatsapp" element={<WhatsAppLogs />} />
          <Route path="/admin/email" element={<EmailLogs />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/menu-management" element={<MenuManagement />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
