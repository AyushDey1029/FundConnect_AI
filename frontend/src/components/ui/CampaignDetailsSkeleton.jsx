import React from 'react';

const CampaignDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full animate-pulse">
      {/* Main Content Area Skeleton */}
      <div className="lg:col-span-2 space-y-12">
        {/* Header Section Skeleton */}
        <div>
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
          <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
          
          <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </div>
        </div>

        {/* Media Gallery Skeleton */}
        <div className="rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-video w-full" />

        {/* Story Section Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <div className="lg:col-span-1 relative">
        <div className="sticky top-24 space-y-6">
          {/* Donate Card Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex justify-between items-end mb-4">
              <div className="h-10 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full mb-6" />
            
            <div className="flex justify-between mb-6">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>

            <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg mb-3" />
            
            <div className="flex gap-3">
              <div className="h-12 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-12 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsSkeleton;
