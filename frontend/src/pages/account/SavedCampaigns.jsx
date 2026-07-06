import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import apiClient from '../../services/apiClient';
import CampaignCard from '../../components/campaign/CampaignCard';
import CampaignSkeleton from '../../components/ui/CampaignSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

// Premium animated Heart icon for the empty state
const AnimatedHeartIcon = (props) => (
  <motion.div
    animate={{ 
      y: [0, -10, 0],
      scale: [1, 1.08, 1]
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    <Heart className="w-8 h-8 text-rose-500 fill-rose-200/50 dark:fill-rose-950/40" strokeWidth={1.5} {...props} />
  </motion.div>
);

const SavedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const { user } = useSelector((state) => state.auth);

  const fetchSavedCampaigns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users/saved-campaigns');
      setCampaigns(response.data.data.campaigns || []);
    } catch (err) {
      setError('Failed to load saved campaigns.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCampaigns();
  }, []);

  // Real-time synchronization with Redux savedCampaigns changes
  useEffect(() => {
    if (user?.savedCampaigns) {
      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((c) => user.savedCampaigns.includes(c._id))
      );
    }
  }, [user?.savedCampaigns]);

  // Sort campaigns dynamically based on selection
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (sortBy === 'goal-high') {
      return b.goalAmount - a.goalAmount;
    }
    if (sortBy === 'goal-low') {
      return a.goalAmount - b.goalAmount;
    }
    if (sortBy === 'progress-high') {
      const progressA = (a.raisedAmount || 0) / a.goalAmount;
      const progressB = (b.raisedAmount || 0) / b.goalAmount;
      return progressB - progressA;
    }
    // Default 'newest' (chronological by order saved in database/user model list)
    return 0;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 4].map((n) => (
          <CampaignSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel with Sorting Dropdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="w-5 h-5 mr-2 text-rose-500 fill-rose-500 animate-pulse" />
            Saved Campaigns
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep track of campaigns you want to support or follow.
          </p>
        </div>

        {campaigns.length > 0 && (
          <div className="flex items-center space-x-2 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-start">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-gray-700"
            >
              <option value="newest">Recently Saved</option>
              <option value="progress-high">Highest Progress</option>
              <option value="goal-high">Highest Goal</option>
              <option value="goal-low">Lowest Goal</option>
            </select>
          </div>
        )}
      </div>

      {/* Grid of Saved Campaigns */}
      <AnimatePresence mode="popLayout">
        {campaigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            key="empty"
          >
            <EmptyState
              icon={AnimatedHeartIcon}
              title="No Saved Campaigns"
              message="You haven't bookmarked any campaigns yet. Browse campaigns on the feed to find projects you'd like to save."
              action={
                <Link to="/">
                  <Button className="font-semibold shadow-md shadow-blue-500/10">
                    Explore Causes
                  </Button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 gap-6" 
            key="grid"
          >
            {sortedCampaigns.map((campaign) => (
              <motion.div
                key={campaign._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <CampaignCard campaign={campaign} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedCampaigns;
