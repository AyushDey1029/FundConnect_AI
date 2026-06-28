import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, IndianRupee } from 'lucide-react';
import Button from '../ui/Button';

const CampaignActions = ({ campaignId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center space-x-1">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        
        <button className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
        
        <button className="p-2 rounded-full text-gray-500 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-full transition-colors ${isSaved ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        <Button variant="primary" size="sm" className="pl-3">
          <IndianRupee className="w-4 h-4 mr-1.5" />
          Donate
        </Button>
      </div>
    </div>
  );
};

export default CampaignActions;
