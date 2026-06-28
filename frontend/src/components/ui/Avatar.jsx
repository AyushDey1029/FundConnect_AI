import React from 'react';

const Avatar = ({ src, alt = "User avatar", size = "md", className = "", fallback }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-full shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
      ) : null}
      
      <span 
        className="font-medium text-gray-600 dark:text-gray-300"
        style={{ display: src ? 'none' : 'flex' }}
      >
        {fallback ? getInitials(fallback) : getInitials(alt)}
      </span>
    </div>
  );
};

export default Avatar;
