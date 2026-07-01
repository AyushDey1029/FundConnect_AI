import React from 'react';

const CampaignMedia = ({ media, title, trustScore }) => {
  const hasMedia = media && media.length > 0;
  const coverMedia = hasMedia ? media[0] : null;
  const isVideo = coverMedia?.type === 'video';
  const srcUrl = coverMedia?.url || (typeof coverMedia === 'string' ? coverMedia : 'https://placehold.co/600x400/e2e8f0/475569?text=No+Image');

  return (
    <div className="relative w-full h-64 sm:h-80 bg-gray-100 dark:bg-gray-800 overflow-hidden group">
      {isVideo ? (
        <video src={srcUrl} autoPlay muted loop className="w-full h-full object-cover" />
      ) : (
        <img 
          src={srcUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: coverMedia?.objectPosition || '50% 50%' }}
        />
      )}
      
      {trustScore && trustScore.score && (
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center space-x-1.5 border border-white/20">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${trustScore.score > 70 ? 'bg-green-400' : trustScore.score > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${trustScore.score > 70 ? 'bg-green-500' : trustScore.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            Trust: {trustScore.score}%
          </span>
        </div>
      )}
    </div>
  );
};

export default CampaignMedia;
