import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { User, Grid, Heart, Clock, Settings as SettingsIcon } from 'lucide-react';

import MyCampaigns from './MyCampaigns';
import DonationHistory from './DonationHistory';

// Stub components for sub-pages
const Overview = () => <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"><h2 className="text-xl font-bold mb-4">Account Overview</h2><p className="text-gray-500">Overview content coming soon.</p></div>;
const SavedCampaigns = () => <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"><h2 className="text-xl font-bold mb-4">Saved Campaigns</h2><p className="text-gray-500">Saved items coming soon.</p></div>;
const Settings = () => <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"><h2 className="text-xl font-bold mb-4">Account Settings</h2><p className="text-gray-500">Settings coming soon.</p></div>;

const AccountLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/account', icon: User, exact: true },
    { name: 'My Campaigns', path: '/account/campaigns', icon: Grid },
    { name: 'Donation History', path: '/account/donations', icon: Clock },
    { name: 'Saved Campaigns', path: '/account/saved', icon: Heart },
    { name: 'Settings', path: '/account/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
      <Navbar />
      
      <main className="flex-1 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                  
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/campaigns" element={<MyCampaigns />} />
              <Route path="/donations" element={<DonationHistory />} />
              <Route path="/saved" element={<SavedCampaigns />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountLayout;
