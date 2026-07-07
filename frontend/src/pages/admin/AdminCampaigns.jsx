import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await adminService.getCampaigns();
      setCampaigns(data);
      setFilteredCampaigns(data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCampaigns(campaigns);
    } else {
      const q = search.toLowerCase();
      setFilteredCampaigns(
        campaigns.filter((c) => c.title.toLowerCase().includes(q) || c.creator?.name.toLowerCase().includes(q))
      );
    }
  }, [search, campaigns]);

  const handleApprove = async (id) => {
    try {
      await adminService.approveCampaign(id);
      toast.success('Campaign approved');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to approve campaign');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectCampaign(id);
      toast.success('Campaign rejected');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to reject campaign');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be fully undone.')) {
      try {
        await adminService.deleteCampaign(id);
        toast.success('Campaign deleted');
        fetchCampaigns();
      } catch (error) {
        toast.error('Failed to delete campaign');
      }
    }
  };

  if (loading) return <div className="text-gray-500 dark:text-gray-400 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Campaigns</h1>
        <div className="w-full sm:w-64">
          <Input 
            placeholder="Search campaigns..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Creator</th>
                <th className="px-4 py-3 font-medium">Goal</th>
                <th className="px-4 py-3 font-medium">Raised</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredCampaigns.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium truncate max-w-[200px]" title={c.title}>{c.title}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{c.creator?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">₹{c.goalAmount}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">₹{c.raisedAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${c.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}
                    `}>
                      {c.verificationStatus === 'pending' ? 'Pending' : c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/campaigns/${c._id}`)}>View</Button>
                      {c.verificationStatus !== 'verified' && (
                        <Button variant="primary" size="sm" onClick={() => handleApprove(c._id)}>Approve</Button>
                      )}
                      {c.verificationStatus !== 'rejected' && c.status !== 'cancelled' && (
                        <Button variant="outline" size="sm" onClick={() => handleReject(c._id)}>Reject</Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(c._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No campaigns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminCampaigns;
