import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, PlusCircle, User, LogIn } from 'lucide-react';
import { useSelector } from 'react-redux';

const BottomNav = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Hide bottom nav on desktop, or specific screens like login/register if needed
  if (
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  const navItems = [
    { name: 'Feed', icon: Home, path: '/' },
    { name: 'Explore', icon: Compass, path: '/categories' },
    { 
      name: 'Create', 
      icon: PlusCircle, 
      path: isAuthenticated ? '/campaigns/create' : '/login',
      prominent: true 
    },
    { 
      name: 'Profile', 
      icon: isAuthenticated ? User : LogIn, 
      path: isAuthenticated ? '/account' : '/login',
      avatar: isAuthenticated && user?.profilePicture ? user.profilePicture : null
    },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/60 dark:border-gray-800/60 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.prominent) {
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center relative -top-5"
              >
                <div className="bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/30 transform transition-transform hover:scale-105 active:scale-95">
                  <Icon className="w-7 h-7" />
                </div>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full py-1 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } transition-colors`}
            >
              {item.avatar ? (
                <div className={`w-6 h-6 rounded-full overflow-hidden border-2 ${isActive ? 'border-blue-600 dark:border-blue-400' : 'border-transparent'}`}>
                  <img src={item.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              )}
              <span className="text-[10px] font-medium mt-1">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
