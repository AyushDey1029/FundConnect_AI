import React from 'react';
import { formatDistanceToNow } from '../../utils/formatDate';
import Avatar from '../ui/Avatar';
import { MoreHorizontal } from 'lucide-react';

const CampaignHeader = ({ creator, createdAt, category, title }) => {
  const timeAgo = formatDistanceToNow(createdAt) || 'Recently';

  return (
    <div className="flex items-start justify-between p-4">
      <div className="flex items-center space-x-3">
        <Avatar src={creator?.profilePicture} alt={creator?.name} fallback={creator?.name} />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {creator?.name || 'Unknown User'}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {timeAgo} • <span className="font-medium">{category}</span>
          </p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CampaignHeader;
