import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import apiClient from '../../services/apiClient';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ReceiptModal from '../../components/campaign/ReceiptModal';
import { motion } from 'framer-motion';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/donations/my-donations');
      setDonations(response.data.data.donations);
    } catch (err) {
      setError('Failed to load donation history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (donationId) => {
    try {
      setReceiptLoading(true);
      const response = await apiClient.get(`/donations/${donationId}/receipt`);
      setReceiptData(response.data.data.receipt);
      setIsReceiptOpen(true);
    } catch (err) {
      alert('Failed to load receipt details.');
      console.error(err);
    } finally {
      setReceiptLoading(false);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Spinner size="xl" /></div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Donation History</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track the causes you've supported.</p>
      </div>

      {donations.length === 0 ? (
        <div className="p-6">
          <EmptyState 
            title="No donations yet"
            message="You haven't made any donations yet. Discover campaigns to support!"
            action={
              <Link to="/">
                <Button>Explore Campaigns</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4 font-semibold">Campaign</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <motion.tbody 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="divide-y divide-gray-200 dark:divide-gray-800"
            >
              {donations.map((donation) => {
                const coverImage = donation.campaign?.media?.find(m => m.type === 'image')?.url || 'https://via.placeholder.com/150';
                return (
                  <motion.tr 
                    key={donation._id} 
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/campaigns/${donation.campaign?._id}`} className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                        <img src={coverImage} alt={donation.campaign?.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 max-w-[200px]" title={donation.campaign?.title}>
                            {donation.campaign?.title || 'Unknown Campaign'}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white">₹{donation.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      <div className="flex items-center">
                        {donation.status === 'successful' ? (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                             <CheckCircle className="w-3 h-3 mr-1" /> Success
                           </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            <Clock className="w-3 h-3 mr-1" /> Pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {donation.status === 'successful' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewReceipt(donation._id)}
                          disabled={receiptLoading}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Receipt
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        receipt={receiptData} 
      />
    </div>
  );
};

export default DonationHistory;
