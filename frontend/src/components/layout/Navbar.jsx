import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, Bell, PlusCircle, User, LogOut, 
  Settings, Heart, Grid, Moon, Sun, Menu, X, Shield, MessageSquare, DollarSign
} from 'lucide-react';
import { logout } from '../../store/authSlice';
import { notificationService } from '../../services/notification.service';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import logoImg from '../../assets/Logo.png';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

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

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const handleNotificationIconClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false);
    if (!notificationDropdownOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationService.markAsRead(notification._id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(notifications.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        ));
      }
      setNotificationDropdownOpen(false);
      if (notification.campaign?._id) {
        navigate(`/campaigns/${notification.campaign._id}`);
      }
    } catch (error) {
      console.error('Failed to handle notification click', error);
    }
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
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 ml-2">
              <img src={logoImg} alt="FundConnect AI" className="h-12 sm:h-16 w-auto object-contain rounded" />
              <span className="font-bold text-xl sm:text-2xl tracking-tight hidden sm:block text-gray-900 dark:text-white mt-1">
                FundConnect
              </span>
            </Link>
            
            <form onSubmit={handleSearchSubmit} className="hidden md:block ml-8 flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                  placeholder="Search campaigns..."
                />
              </div>
            </form>
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

                {/* Notification Dropdown */}
                <div className="relative">
                  <button 
                    onClick={handleNotificationIconClick}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                    )}
                  </button>

                  {notificationDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setNotificationDropdownOpen(false)}></div>
                      <div className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 animate-in fade-in slide-in-from-top-2 overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                              No notifications yet
                            </div>
                          ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                              {notifications.map((notif) => {
                                let Icon = Shield;
                                if (notif.type === 'donation') Icon = DollarSign;
                                else if (notif.type === 'comment') Icon = MessageSquare;
                                else if (notif.type === 'save_campaign') Icon = Heart;

                                return (
                                  <li 
                                    key={notif._id} 
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors flex gap-3 ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                  >
                                    <div className={`mt-0.5 rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0 ${
                                      notif.type === 'donation' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                      notif.type === 'comment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                      notif.type === 'save_campaign' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' :
                                      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {notif.title}
                                        {!notif.isRead && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500"></span>}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                                        {notif.message}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {timeAgo(notif.createdAt)}
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

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
                          {user?.role === 'admin' && (
                            <Link to="/admin" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <Shield className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                              Admin Dashboard
                            </Link>
                          )}
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
