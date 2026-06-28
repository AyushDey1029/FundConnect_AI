import React from 'react';

const CampaignFooter = ({ likesCount, commentsCount }) => {
  return (
    <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-900/30 text-xs text-gray-500 dark:text-gray-400 font-medium">
      {likesCount > 0 ? (
        <span className="mr-3">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
      ) : null}
      {commentsCount > 0 ? (
        <span>View all {commentsCount} comments</span>
      ) : (
        <span>Be the first to comment</span>
      )}
    </div>
  );
};

export default CampaignFooter;
