import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute.jsx';

// Import Pages
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import CampaignDetails from '../pages/CampaignDetails.jsx';
import AccountLayout from '../pages/account/AccountLayout.jsx';

const AppRouter = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/campaigns/:id" element={<CampaignDetails />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/account/*" element={<AccountLayout />} />
      </Route>
      
      <Route path="*" element={<div className="flex items-center justify-center h-screen text-2xl font-bold">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
