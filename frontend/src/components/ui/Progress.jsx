import React from 'react';
import { motion } from 'framer-motion';

const Progress = ({ value = 0, max = 100, className = '', color = 'bg-blue-600' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden ${className}`}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full ${color}`}
      />
    </div>
  );
};

export default Progress;
