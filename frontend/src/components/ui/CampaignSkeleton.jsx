import React from 'react';
import { Card } from './Card';

const CampaignSkeleton = () => {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <Card className="h-full shadow-sm border-gray-100 dark:border-gray-800 overflow-hidden">
        
        {/* 1. Large Media Skeleton */}
        <div className="w-full relative aspect-[4/3] bg-gray-200 dark:bg-gray-800 animate-pulse" />

        <div className="p-6">
          {/* 3. Category (Badge) & Location Skeleton */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          
          {/* 2. Title Skeleton */}
          <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse" />

          {/* 6. Description Skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>

          {/* 4. Progress & 5. Amount Raised / Goal Skeleton */}
          <div className="mb-6 space-y-3">
            <div className="flex justify-between items-end">
              <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            <div className="flex justify-between pt-1">
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

          {/* 7. Creator & 8. Actions Skeleton */}
          <div className="flex items-center justify-between">
            {/* Creator */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="flex flex-col space-y-1">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="w-24 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>
          
        </div>
      </Card>
    </div>
  );
};

export default CampaignSkeleton;
