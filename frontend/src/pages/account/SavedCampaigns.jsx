import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import apiClient from '../../services/apiClient';
import CampaignCard from '../../components/campaign/CampaignCard';
import CampaignSkeleton from '../../components/ui/CampaignSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const SavedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="w-5 h-5 mr-2 text-rose-500 fill-rose-500" />
            Saved Campaigns
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep track of campaigns you want to support or follow.
          </p>
        </div>
        <Link to="/">
          <Button size="sm" variant="outline">
            Browse Feed
          </Button>
        </Link>
      </div>

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
              icon={Heart}
              title="No Saved Campaigns"
              message="You haven't bookmarked any campaigns yet. Browse campaigns on the feed to find projects you'd like to save."
              action={
                <Link to="/">
                  <Button size="sm" className="font-semibold shadow-md shadow-blue-500/10">
                    Explore Causes
                  </Button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key="grid">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <CampaignCard campaign={campaign} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedCampaigns;
