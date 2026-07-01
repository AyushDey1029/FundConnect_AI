import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Share2, Tag, CheckCircle, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import CampaignUpdates from '../components/campaign/CampaignUpdates';
import CampaignComments from '../components/campaign/CampaignComments';
import CheckoutModal from '../components/campaign/CheckoutModal';
import apiClient from '../services/apiClient';

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const isCreator = isAuthenticated && user?._id === (campaign?.creator?._id || campaign?.creator);

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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><Spinner size="xl" /></div>;
  }

  if (error || !campaign) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"><h2>{error || 'Campaign not found'}</h2></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center text-green-700 dark:text-green-400 font-medium">
              <CheckCircle className="w-5 h-5 mr-3" />
              Thank you! Your donation was successfully processed.
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-green-500 hover:text-green-700 dark:hover:text-green-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

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
                <div className="mb-6">
                  <div className="flex items-end space-x-2 mb-2">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      ₹{campaign.raisedAmount?.toLocaleString()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 pb-1">
                      raised of ₹{campaign.goalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(campaign.raisedAmount / campaign.goalAmount) * 100} max={100} className="mb-2" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {campaign.donorsCount || 0} donations
                  </p>
                </div>

                {isCreator ? (
                  <Button size="lg" fullWidth className="mb-3" disabled>
                    This is your campaign
                  </Button>
                ) : (
                  <Button size="lg" fullWidth className="mb-3" onClick={() => setIsCheckoutOpen(true)}>Donate Now</Button>
                )}
                
                <Button size="lg" variant="outline" fullWidth onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Campaign
                </Button>
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

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        campaign={campaign} 
        onSuccess={() => {
          fetchCampaign(); // Refetch the campaign details to update amount & donors
          setShowSuccess(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => setShowSuccess(false), 8000);
        }} 
      />

      <Footer />
    </div>
  );
};

export default CampaignDetails;
