import React from 'react';
import { Link } from 'react-router-dom';
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

const Home = () => {
  const { campaigns, loading, error, hasMore, loadMore, loadingMore } = useCampaigns();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
      <Navbar />
      
      <main className="flex-1">
        <PageWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-24 pb-16 sm:pt-32 sm:pb-24">
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
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">Explore Causes</Button>
            </div>
          </div>
        </section>

        {/* Categories / Quick Filters (Stub) */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full font-medium whitespace-nowrap text-sm border border-blue-100 dark:border-blue-800/30 transition-colors">
              <Sparkles className="w-4 h-4" />
              <span>For You</span>
            </button>
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full font-medium whitespace-nowrap text-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <Flame className="w-4 h-4" />
              <span>Trending</span>
            </button>
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full font-medium whitespace-nowrap text-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>Newest</span>
            </button>
            {/* Add more categories here */}
          </div>
        </div>

        {/* Main Feed */}
        <section className="max-w-2xl mx-auto px-4 pb-12">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <CampaignSkeleton key={n} />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center bg-white dark:bg-gray-900 rounded-xl border border-red-100 dark:border-red-900/30">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
          ) : campaigns.length === 0 ? (
            <EmptyState 
              title="No campaigns found"
              message="Check back later for new causes to support."
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
                    className="w-full sm:w-auto"
                  >
                    {loadingMore ? 'Loading more...' : 'Load More Campaigns'}
                  </Button>
                </div>
              )}
              
              {!hasMore && campaigns.length > 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 pb-4">
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
