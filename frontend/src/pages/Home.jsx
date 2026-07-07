import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import CampaignCard from '../components/campaign/CampaignCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import CampaignSkeleton from '../components/ui/CampaignSkeleton';
import { useCampaigns } from '../hooks/useCampaigns';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES_WITH_EMOJIS = [
  { name: 'Medical', emoji: '🏥' },
  { name: 'Education', emoji: '🎓' },
  { name: 'Startup', emoji: '🚀' },
  { name: 'Environment', emoji: '🌱' },
  { name: 'Animal Welfare', emoji: '🐾' },
  { name: 'NGO', emoji: '🤝' },
  { name: 'Disaster Relief', emoji: '🚨' },
  { name: 'Technology', emoji: '💻' },
  { name: 'Creative', emoji: '🎨' },
  { name: 'Community', emoji: '👥' },
  { name: 'Health', emoji: '⚕️' },
  { name: 'Other', emoji: '📦' }
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [feedType, setFeedType] = useState('feed'); // 'feed', 'trending', 'newest', 'category'
  const [activeCategory, setActiveCategory] = useState('');

  // Sync state if URL search query changes
  useEffect(() => {
    if (search) {
      setFeedType('feed');
      setActiveCategory('');
    }
  }, [search]);

  // Determine endpoint and params for useCampaigns hook
  let endpoint = '/campaigns/feed';
  let params = {};

  if (search) {
    endpoint = '/campaigns/feed';
    params = { search };
  } else if (feedType === 'category' && activeCategory) {
    endpoint = `/campaigns/category/${activeCategory}`;
  } else if (feedType === 'trending') {
    endpoint = '/campaigns/trending';
  } else if (feedType === 'newest') {
    endpoint = '/campaigns/newest';
  }

  const { campaigns, loading, error, hasMore, loadMore, loadingMore } = useCampaigns(endpoint, params);

  const handleFeedTypeChange = (type) => {
    setFeedType(type);
    setActiveCategory('');
    // Remove search param from URL
    if (searchParams.has('search')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams);
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (activeCategory === categoryName && feedType === 'category') {
      handleFeedTypeChange('feed');
    } else {
      setFeedType('category');
      setActiveCategory(categoryName);
      // Remove search param from URL
      if (searchParams.has('search')) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('search');
        setSearchParams(newParams);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
      <Navbar />
      
      <main className="flex-1 min-h-screen">
        <PageWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-20 pb-12 sm:pt-24 sm:pb-16 border-b border-gray-100 dark:border-gray-900/40">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
              Fund the future, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">together.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Discover and support verified campaigns with AI-powered trust scores. Join a community of changemakers today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/campaigns/create">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-blue-500/20">Start a Campaign</Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base" onClick={() => handleFeedTypeChange('trending')}>Explore Causes</Button>
            </div>
          </div>
        </section>

        {/* Categories & Feeds Section */}
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Quick Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide border-b border-gray-200 dark:border-gray-900/50">
            <button 
              onClick={() => handleFeedTypeChange('feed')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm border transition-all duration-200 ${
                feedType === 'feed' && !search
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800/30 font-semibold'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>For You</span>
            </button>
            <button 
              onClick={() => handleFeedTypeChange('trending')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm border transition-all duration-200 ${
                feedType === 'trending'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800/30 font-semibold'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Trending</span>
            </button>
            <button 
              onClick={() => handleFeedTypeChange('newest')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm border transition-all duration-200 ${
                feedType === 'newest'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800/30 font-semibold'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Newest</span>
            </button>
          </div>

          {/* Category Badges */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES_WITH_EMOJIS.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  feedType === 'category' && activeCategory === cat.name
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30 scale-105 shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-750'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Feed Section */}
        <section className="max-w-2xl mx-auto px-4 pb-12 space-y-6">
          {/* Section Header Heading */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {search ? (
                <>Search results for <span className="text-blue-600 dark:text-blue-400">"{search}"</span></>
              ) : feedType === 'category' ? (
                <>Causes in <span className="text-emerald-600 dark:text-emerald-400">{activeCategory}</span></>
              ) : feedType === 'trending' ? (
                'Trending Campaigns'
              ) : feedType === 'newest' ? (
                'Newest Campaigns'
              ) : (
                'Explore Campaigns'
              )}
            </h2>
            {campaigns.length > 0 && !loading && (
              <span className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{campaigns.length} campaigns</span>
            )}
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <CampaignSkeleton key={n} />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
              <p className="text-red-500 mb-4 font-semibold">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
          ) : campaigns.length === 0 ? (
            <EmptyState 
              title={search ? "No results found" : "No campaigns found"}
              message={search 
                ? `We couldn't find any campaigns matching "${search}". Try searching for another keyword or check categories.`
                : "No active campaigns found in this category right now. Check back later or browse other causes!"
              }
              action={
                (search || feedType !== 'feed') && (
                  <Button size="sm" onClick={() => handleFeedTypeChange('feed')}>
                    Reset Filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="space-y-8">
              <motion.div 
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="space-y-8"
              >
                {campaigns.map(campaign => (
                  <motion.div 
                    key={campaign._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                  >
                    <CampaignCard campaign={campaign} />
                  </motion.div>
                ))}
              </motion.div>
              
              {hasMore && (
                <div className="pt-4 text-center">
                  <Button 
                    onClick={loadMore} 
                    isLoading={loadingMore}
                    variant="outline"
                    className="w-full sm:w-auto font-semibold"
                  >
                    {loadingMore ? 'Loading more...' : 'Load More Campaigns'}
                  </Button>
                </div>
              )}
              
              {!hasMore && campaigns.length > 0 && (
                <p className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pt-8 pb-4">
                  You've caught up with all campaigns.
                </p>
              )}
            </div>
          )}
        </section>
        </PageWrapper>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
