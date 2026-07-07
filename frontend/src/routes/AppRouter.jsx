import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import BottomNav from '../components/layout/BottomNav.jsx';

// Import Pages
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import CampaignDetails from '../pages/CampaignDetails.jsx';
import CreateCampaign from '../pages/campaign/CreateCampaign.jsx';
import AccountLayout from '../pages/account/AccountLayout.jsx';

// Import Admin Pages
import AdminLayout from '../pages/admin/AdminLayout.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminCampaigns from '../pages/admin/AdminCampaigns.jsx';
import AdminUsers from '../pages/admin/AdminUsers.jsx';
import AdminReports from '../pages/admin/AdminReports.jsx';

const AppRouter = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/campaigns/:id" element={<CampaignDetails />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />} />
      <Route path="/reset-password/:token" element={isAuthenticated ? <Navigate to="/" /> : <ResetPassword />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/account/*" element={<AccountLayout />} />
        <Route path="/campaigns/create" element={<CreateCampaign />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Route>

      <Route path="*" element={<div className="flex items-center justify-center h-screen text-2xl font-bold">404 Not Found</div>} />
    </Routes>
    <BottomNav />
  </>
  );
};

export default AppRouter;
