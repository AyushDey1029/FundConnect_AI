import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, Bell, PlusCircle, User, LogOut, 
  Settings, Heart, Grid, Moon, Sun, Menu, X
} from 'lucide-react';
import { logout } from '../../store/authSlice';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check initial theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/85 dark:bg-gray-900/85 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-800/50' 
          : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-transparent dark:border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo & Search */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img src="/src/assets/Logo.png" alt="FundConnect AI" className="h-10 sm:h-12 w-auto object-contain rounded" />
              <span className="font-bold text-xl tracking-tight hidden sm:block text-gray-900 dark:text-white">
                FundConnect
              </span>
            </Link>
            
            <div className="hidden md:block ml-8 flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                  placeholder="Search campaigns..."
                />
              </div>
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/campaigns/create" className="hidden sm:block">
                  <Button size="sm" className="hidden sm:flex">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Start Campaign
                  </Button>
                </Link>

                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative ml-2">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <Avatar src={user?.profilePicture} fallback={user?.name} size="sm" />
                  </button>

                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)}></div>
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 z-20 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/account" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                            Dashboard
                          </Link>
                          <Link to="/account/campaigns" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Grid className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                            My Campaigns
                          </Link>
                          <Link to="/account/saved" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Heart className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                            Saved
                          </Link>
                          <Link to="/account/settings" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                            Settings
                          </Link>
                        </div>
                        <div className="py-1">
                          <button onClick={handleLogout} className="group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                            <LogOut className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-2">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-gray-800">
              Feed
            </Link>
            <Link to="/categories" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300">
              Categories
            </Link>
          </div>
          
          {!isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center px-4 space-x-3">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" fullWidth>Log in</Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button fullWidth>Sign up</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
