import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Donation Receipt
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
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <span className="font-medium text-gray-500">Date</span>
              <span>{new Date(receipt.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <span className="font-medium text-gray-500">Receipt No.</span>
              <span className="font-mono text-xs">{receipt.receiptNo}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <span className="font-medium text-gray-500">Transaction ID</span>
              <span className="font-mono text-xs">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <span className="font-medium text-gray-500">Campaign</span>
              <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px]" title={receipt.campaign}>
                {receipt.campaign}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <span className="font-medium text-gray-500">Amount</span>
              <span className="font-bold text-gray-900 dark:text-white">₹{receipt.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-medium text-gray-500">Donor</span>
              <span>{receipt.donor}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Thank you for your generous contribution!
            </p>
            <Button size="sm" onClick={onClose} fullWidth>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
