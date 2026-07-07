import React from 'react';
import { Loader2 } from 'lucide-react';

import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'group inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] focus:ring-blue-500 border border-blue-500/50',
    secondary: 'bg-gradient-to-r from-gray-100 to-white text-gray-900 hover:shadow-[0_0_15px_rgba(209,213,219,0.5)] focus:ring-gray-500 dark:from-gray-800 dark:to-gray-900 dark:text-gray-100 dark:hover:shadow-[0_0_15px_rgba(75,85,99,0.4)] border border-gray-200 dark:border-gray-700',
    outline: 'border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50 focus:ring-gray-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800/50 hover:shadow-[0_0_15px_rgba(156,163,175,0.2)]',
    ghost: 'text-gray-700 hover:bg-gray-100/50 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800/50 hover:shadow-[0_0_15px_rgba(156,163,175,0.1)]',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] focus:ring-red-500 border border-red-500/50',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    icon: 'p-2',
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.95 }}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Subtle shine effect on hover for primary/danger */}
      {(variant === 'primary' || variant === 'danger') && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
      )}
      
      <span className="relative flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
