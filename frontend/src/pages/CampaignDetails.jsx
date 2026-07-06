import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Share2, Tag, CheckCircle, X, Heart } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import Avatar from '../components/ui/Avatar';
import CampaignSkeleton from '../components/ui/CampaignSkeleton';
import CountUp from '../components/ui/CountUp';
import CampaignUpdates from '../components/campaign/CampaignUpdates';
import CampaignComments from '../components/campaign/CampaignComments';
import CheckoutModal from '../components/campaign/CheckoutModal';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';
import { updateUser } from '../store/authSlice';

const CampaignDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const isSaved = isAuthenticated && user?.savedCampaigns?.includes(campaign?._id);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save campaigns');
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.post(`/users/saved-campaigns/${campaign._id}`);
      
      dispatch(updateUser({
        ...user,
        savedCampaigns: response.data.data.savedCampaigns
      }));
      
      toast.success(response.data.message, {
        icon: isSaved ? '💔' : '💖',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update save status');
    } finally {
      setSaving(false);
    }
  };

  const isCreator = isAuthenticated && campaign && user?._id === (campaign.creator?._id || campaign.creator);
  const percentage = campaign ? Math.min(100, Math.max(0, ((campaign.raisedAmount || 0) / campaign.goalAmount) * 100)) : 0;

  const fetchCampaign = async () => {
    try {
      const response = await apiClient.get(`/campaigns/${id}`);
      setCampaign(response.data.data.campaign);
    } catch (err) {
      setError('Failed to load campaign details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCampaign();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
        <Navbar />
        <main className="flex-1 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="lg:col-span-2">
            <CampaignSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"><h2>{error || 'Campaign not found'}</h2></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
      <Navbar />
      
      <PageWrapper>
      <main className="flex-1 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Continuous Scroll) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Header Section */}
            <div>
              <div className="flex items-center space-x-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                <Tag className="w-4 h-4" />
                <span>{campaign.category}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                {campaign.title}
              </h1>
              <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                <Avatar size="lg" src={campaign.creator?.profilePicture} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Organized by</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {campaign.creator?.firstName} {campaign.creator?.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            {campaign.media && campaign.media.length > 0 && (
              <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video">
                {campaign.media[0].type === 'video' ? (
                  <video src={campaign.media[0].url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={campaign.media[0].url} alt={campaign.title} className="w-full h-full object-cover" style={{ objectPosition: campaign.media[0].objectPosition || '50% 50%' }} />
                )}
              </div>
            )}

            {/* Story Section */}
            <section id="story">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Story</h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {campaign.description}
              </div>
            </section>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Updates Section */}
            <section id="updates">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Updates</h2>
              <CampaignUpdates campaignId={campaign._id} creatorId={campaign.creator?._id} />
            </section>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Comments Section */}
            <section id="comments">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Comments</h2>
              <CampaignComments campaignId={campaign._id} />
            </section>
          </div>

          {/* Right Sidebar (Sticky) */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-24 space-y-6">
              
              {/* Donate Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                {/* Progress Details */}
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-1 text-gray-900 dark:text-white tabular-nums">
                    <CountUp value={campaign.raisedAmount || 0} prefix="₹" className="text-3xl sm:text-4xl font-extrabold tracking-tight" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                      raised of <CountUp value={campaign.goalAmount} prefix="₹" /> goal
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-400 dark:text-gray-500 min-w-[3ch] text-right">
                    {Math.round(percentage)}%
                  </div>
                </div>
                
                <Progress value={percentage} className="h-3 mb-4" />
                
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    <CountUp value={campaign.donorsCount || 0} /> <span className="ml-1">donors</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1.5" />
                    {campaign.category}
                  </div>
                </div>

                {isCreator ? (
                  <Button size="lg" fullWidth className="mb-3" disabled>
                    This is your campaign
                  </Button>
                ) : percentage >= 100 ? (
                  <Button size="lg" fullWidth className="mb-3" disabled>
                    Goal Reached
                  </Button>
                ) : (
                  <Button size="lg" fullWidth className="mb-3" onClick={() => setIsCheckoutOpen(true)}>Donate Now</Button>
                )}
                
                <div className="flex gap-3">
                  <Button size="lg" variant="outline" className="flex-1" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className={`flex-1 transition-all duration-200 ${
                      isSaved 
                        ? 'text-rose-500 border-rose-200 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-950/20' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                    }`}
                    onClick={handleSaveToggle}
                    disabled={saving}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>

              {/* AI Trust Summary */}
              {campaign.trustScore && (
                <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      AI Trust Summary
                    </h3>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold">
                      Score: {campaign.trustScore.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {campaign.trustScore.explanation}
                  </p>
                </div>
              )}

              {/* Sharing Quick Links */}
              <div className="flex justify-center space-x-4 pt-4">
                <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this campaign!`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors font-medium text-sm">
                  X
                </a>
                <a href={`https://wa.me/?text=Check out this campaign: ${window.location.href}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-500 transition-colors font-medium text-sm">
                  WhatsApp
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors font-medium text-sm">
                  LinkedIn
                </a>
              </div>
              
            </div>
          </div>
        </div>
      </main>
      </PageWrapper>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        campaign={campaign} 
        onSuccess={() => {
          fetchCampaign(); 
          toast.success('Thank you! Your donation was successfully processed.', { duration: 5000 });
        }} 
      />

      <Footer />
    </div>
  );
};

export default CampaignDetails;
