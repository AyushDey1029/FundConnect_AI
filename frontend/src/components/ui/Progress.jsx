import React from 'react';

const Progress = ({ value = 0, max = 100, className = '', color = 'bg-blue-600' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;
