import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import Avatar from '../components/ui/Avatar';

const CampaignDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Gallery / Cover Placeholder */}
        <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8 flex items-center justify-center">
          <span className="text-gray-400">Campaign Cover Image</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Creator */}
            <div>
              <div className="flex items-center space-x-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                <span>Category Name</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Campaign Title {id}
              </h1>
              <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                <Avatar size="lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Organized by</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Creator Name</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Stub) */}
            <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-800">
              <button className="pb-4 border-b-2 border-blue-600 text-blue-600 font-medium">Story</button>
              <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium">Updates</button>
              <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium">Comments</button>
            </div>

            {/* Summary / Story */}
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p>Campaign description and story will go here. This is a placeholder for Phase 4 where we will fetch the full campaign details from the backend and display them beautifully.</p>
            </div>
          </div>

          {/* Sidebar / Donate Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-end space-x-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">₹0</span>
                  <span className="text-gray-500 dark:text-gray-400 pb-1">raised of ₹10,000</span>
                </div>
                <Progress value={0} max={100} className="mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">0 donations</p>
              </div>

              <Button size="lg" fullWidth className="mb-4">Donate Now</Button>
              <Button size="lg" variant="outline" fullWidth>Share Campaign</Button>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Donors</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">No donations yet. Be the first!</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CampaignDetails;
