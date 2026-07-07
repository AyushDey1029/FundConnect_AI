import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Eye, Edit2, BarChart2, MessageSquare, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import apiClient from '../../services/apiClient';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  const fetchMyCampaigns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/campaigns/me');
      setCampaigns(response.data.data.campaigns);
    } catch (err) {
      setError('Failed to load campaigns.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await apiClient.delete(`/campaigns/${id}`);
      setCampaigns(campaigns.filter(c => c._id !== id));
      setOpenDropdownId(null);
    } catch (err) {
      alert('Failed to delete campaign');
      console.error(err);
    }
  };

  const calculateDaysRemaining = (deadline) => {
    const diffTime = Math.abs(new Date(deadline) - new Date());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  const toggleDropdown = (id) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Spinner size="xl" /></div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Campaigns</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all the campaigns you've created.</p>
        </div>
        <Link to="/campaigns/create">
          <Button size="sm">Create New</Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-6">
          <EmptyState 
            title="No campaigns yet"
            message="You haven't created any campaigns yet."
            action={
              <Link to="/campaigns/create">
                <Button>Start your first campaign</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto pb-48 min-h-[350px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4 font-semibold">Campaign</th>
                <th className="px-6 py-4 font-semibold">Raised / Goal</th>
                <th className="px-6 py-4 font-semibold">Donors</th>
                <th className="px-6 py-4 font-semibold">Time Left</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="divide-y divide-gray-200 dark:divide-gray-800"
            >
              {campaigns.map((campaign, index) => {
                const imageMedia = campaign.media?.find(m => m.type === 'image');
                const videoMedia = campaign.media?.find(m => m.type === 'video');
                
                let coverImage = 'https://via.placeholder.com/150';
                if (imageMedia) {
                  coverImage = imageMedia.url;
                } else if (videoMedia) {
                  coverImage = videoMedia.url.replace(/\.[^/.]+$/, ".jpg");
                }

                const dropUp = index >= campaigns.length - 2 && campaigns.length > 3;

                return (
                  <motion.tr 
                    key={campaign._id} 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 }
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={coverImage} alt={campaign.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 max-w-[200px]" title={campaign.title}>{campaign.title}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{campaign.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-bold text-gray-900 dark:text-white">₹{campaign.raisedAmount?.toLocaleString() || 0}</span>
                        <span className="text-gray-500 dark:text-gray-400"> / ₹{campaign.goalAmount?.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {campaign.donorsCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {calculateDaysRemaining(campaign.deadline)} days
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      {/* Lifecycle Status */}
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                          ${campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                            campaign.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                            campaign.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}
                        `}>
                          {campaign.status}
                        </span>
                      </div>
                      
                      {/* Verification Status */}
                      <div className="flex items-center">
                        {campaign.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            <CheckCircle className="w-3 h-3 mr-1" /> Verified
                          </span>
                        )}
                        {campaign.verificationStatus === 'pending' && (
                          <span className="inline-flex items-center text-xs font-medium text-yellow-600 dark:text-yellow-500">
                            <Clock className="w-3 h-3 mr-1" /> Pending
                          </span>
                        )}
                        {campaign.verificationStatus === 'rejected' && (
                          <span className="inline-flex items-center text-xs font-medium text-red-600 dark:text-red-400">
                            <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => toggleDropdown(campaign._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {openDropdownId === campaign._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: dropUp ? 10 : -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: dropUp ? 10 : -10 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className={`absolute right-8 ${dropUp ? 'bottom-8' : 'top-12'} w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1 text-left`}
                            >
                              <Link to={`/campaigns/${campaign._id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Eye className="w-4 h-4 mr-2 text-gray-400" /> View Campaign
                              </Link>
                              <Link to={`/campaigns/${campaign._id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <MessageSquare className="w-4 h-4 mr-2 text-gray-400" /> Post Update
                              </Link>
                              <Link to={`/campaigns/${campaign._id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <BarChart2 className="w-4 h-4 mr-2 text-gray-400" /> Analytics
                              </Link>
                              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                              <button 
                                onClick={() => handleDelete(campaign._id)}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                              >
                                <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Delete
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCampaigns;
