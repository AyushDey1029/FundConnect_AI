import React from 'react';

const CampaignSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full" />
      
      <div className="p-6">
        {/* Creator Info Skeleton */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          </div>
        </div>

        {/* Title and Description Skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          </div>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex space-x-4">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CampaignSkeleton;
