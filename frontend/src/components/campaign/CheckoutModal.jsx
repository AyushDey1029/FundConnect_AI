import React, { useState, useEffect } from 'react';
import { X, Heart, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import apiClient from '../../services/apiClient';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const CheckoutModal = ({ isOpen, onClose, campaign, onSuccess }) => {
  const [amount, setAmount] = useState(1000);
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const remainingAmount = Math.max(0, (campaign?.goalAmount || 0) - (campaign?.raisedAmount || 0));

  // Load Razorpay script dynamically
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen || !campaign) return null;

  const handleAmountSelect = (val) => {
    setAmount(val);
    setIsCustom(false);
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setAmount('');
  };

  const handleDonate = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!amount || amount < 100) {
      setError('Minimum donation amount is ₹100');
      return;
    }

    if (amount > remainingAmount) {
      setError(`Maximum allowed donation is ₹${remainingAmount.toLocaleString()}`);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 1. Create order/intent on backend
      const intentRes = await apiClient.post(`/donations/${campaign._id}/intent`, { amount });
      const { order } = intentRes.data.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key_missing', 
        amount: order.amount,
        currency: order.currency,
        name: 'FundConnect',
        description: `Donation for ${campaign.title}`,
        order_id: order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#2563EB',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        handler: async function (response) {
          try {
            setLoading(true);
            // 3. Verify on backend
            await apiClient.post(`/donations/${campaign._id}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            // 4. Success callback
            onSuccess();
            onClose();
          } catch (err) {
            console.error('Verification failed:', err);
            setError('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment failed');
        setLoading(false);
      });
      
      rzp.open();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to initialize payment.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2 fill-current" />
            Make a Donation
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Supporting</p>
            <p className="font-semibold text-gray-900 dark:text-white truncate">{campaign.title}</p>
          </div>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Amount (₹)</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => handleAmountSelect(amt)}
                disabled={amt > remainingAmount}
                className={`py-3 rounded-xl font-bold transition-all border-2 ${
                  amount === amt && !isCustom
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                    : amt > remainingAmount
                    ? 'border-gray-100 bg-gray-50 text-gray-300 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-600 cursor-not-allowed'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <button
              onClick={handleCustomToggle}
              className={`w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-2 ${isCustom ? 'hidden' : 'block text-center'}`}
            >
              Enter a custom amount
            </button>
            
            {isCustom && (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-gray-500 dark:text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="100"
                  max={remainingAmount}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="block w-full pl-8 pr-4 py-3 border-2 border-blue-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none font-bold text-lg"
                  placeholder="Custom Amount"
                  autoFocus
                />
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <Button 
            size="lg" 
            fullWidth 
            onClick={handleDonate} 
            disabled={loading || !amount || amount < 100 || amount > remainingAmount || remainingAmount === 0}
          >
            {remainingAmount === 0 ? 'Goal Reached' : (loading ? 'Processing...' : `Donate ₹${amount || 0}`)}
          </Button>

          <div className="mt-4 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium">
            <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
            Secure payment powered by Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
