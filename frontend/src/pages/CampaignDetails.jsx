import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Share2, Tag, CheckCircle, X, Heart, Activity, Users, MessageCircle, Bookmark, Target, TrendingUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import Avatar from '../components/ui/Avatar';
import CampaignDetailsSkeleton from '../components/ui/CampaignDetailsSkeleton';
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
  const [activeTab, setActiveTab] = useState('story');
  const [analytics, setAnalytics] = useState(null);
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

  useEffect(() => {
    if (isCreator) {
      apiClient.get(`/campaigns/${id}/analytics`)
        .then(res => setAnalytics(res.data.data.analytics))
        .catch(err => console.error('Failed to fetch analytics', err));
    }
  }, [id, isCreator]);

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
          <CampaignDetailsSkeleton />
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

            {/* Analytics Dashboard (Creator Only) */}
            {isCreator && analytics && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campaign Analytics</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">Goal Amount</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{analytics.goalAmount.toLocaleString()}</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Raised Amount</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">₹{analytics.raisedAmount.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm font-medium">Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round((analytics.raisedAmount / analytics.goalAmount) * 100)}%</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Total Donors</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.donorsCount}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Comments</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.commentsCount}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                      <Bookmark className="w-4 h-4" />
                      <span className="text-sm font-medium">Total Saves</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.savesCount}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <nav className="-mb-px flex space-x-8">
                {['story', 'updates', 'comments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="pt-6">
              {activeTab === 'story' && (
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {campaign.description}
                </div>
              )}

              {activeTab === 'updates' && (
                <CampaignUpdates campaignId={campaign._id} creatorId={campaign.creator?._id} />
              )}

              {activeTab === 'comments' && (
                <CampaignComments campaignId={campaign._id} />
              )}
            </div>
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
                    title={isSaved ? "Remove from Saved" : "Save Campaign"}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>

              {/* AI Trust Summary hidden for MVP */}

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

      {/* Mobile Sticky CTA */}
      {!isCreator && (
        <div className="sm:hidden fixed bottom-[64px] inset-x-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 z-40 flex items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Button 
            className="w-full text-base py-3 font-semibold shadow-md active:scale-[0.98] transition-transform" 
            onClick={() => {
              if (isAuthenticated) {
                setIsCheckoutOpen(true);
              } else {
                toast.error('Please log in to donate');
              }
            }}
          >
            Donate Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
