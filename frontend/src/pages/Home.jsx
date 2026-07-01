import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CampaignCard from '../components/campaign/CampaignCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useCampaigns } from '../hooks/useCampaigns';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';

const Home = () => {
  const { campaigns, loading, error, hasMore, loadMore, loadingMore } = useCampaigns();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Fund the future, <span className="text-blue-600">together.</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Discover and support verified campaigns with AI-powered trust scores. Join a community of changemakers today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/campaigns/create">
                <Button size="lg" className="w-full sm:w-auto">Start a Campaign</Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore Causes</Button>
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
            <div className="py-20 flex flex-col items-center">
              <Spinner size="lg" className="mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading campaigns...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center bg-white dark:bg-gray-900 rounded-xl border border-red-100 dark:border-red-900/30">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns found</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back later for new causes to support.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {campaigns.map(campaign => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
              
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
      </main>

      <Footer />
    </div>
  );
};

export default Home;
