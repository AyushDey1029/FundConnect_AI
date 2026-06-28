import React from 'react';
import Progress from '../ui/Progress';

const CampaignProgress = ({ goalAmount, raisedAmount, title, description }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const percentage = goalAmount > 0 ? Math.min(100, Math.floor((raisedAmount / goalAmount) * 100)) : 0;

  return (
    <div className="p-4 pb-2">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-1">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
        {description}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-900 dark:text-white">{formatCurrency(raisedAmount)} raised</span>
          <span className="text-gray-500 dark:text-gray-400">of {formatCurrency(goalAmount)}</span>
        </div>
        <Progress value={raisedAmount} max={goalAmount} color="bg-blue-600" />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{percentage}% funded</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignProgress;
