import Donation from '../models/donation.model.js';
import Campaign from '../models/campaign.model.js';
import Notification from '../models/notification.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { razorpayInstance, verifyRazorpaySignature } from '../services/razorpay.service.js';

export const createDonationIntent = catchAsync(async (req, res, next) => {
  const { campaignId } = req.params;
  const { amount } = req.body;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return next(new AppError('No campaign found with that ID', 404));
  }

  // Create Razorpay Order
  const options = {
    amount: Math.round(amount * 100), // Razorpay works in smallest currency unit (paise), must be an integer
    currency: 'INR',
    receipt: `rcpt_${Date.now().toString().slice(-6)}_${campaignId.slice(-6)}`,
  };

  const order = await razorpayInstance.orders.create(options);

  // Create pending donation
  const donation = await Donation.create({
    user: req.user._id,
    campaign: campaignId,
    amount,
    razorpay_order_id: order.id,
    status: 'pending'
  });

  res.status(201).json({
    status: 'success',
    data: {
      order,
      donationId: donation._id
    }
  });
});

export const verifyDonation = catchAsync(async (req, res, next) => {
  const { campaignId } = req.params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isValid) {
    return next(new AppError('Invalid payment signature', 400));
  }

  // Atomically find and update to prevent concurrent race conditions
  const donation = await Donation.findOneAndUpdate(
    { razorpay_order_id, status: 'pending' },
    { razorpay_payment_id, status: 'successful' },
    { new: true }
  );

  if (!donation) {
    const existing = await Donation.findOne({ razorpay_order_id });
    if (existing && existing.status === 'successful') {
      return res.status(200).json({ status: 'success', message: 'Already verified' });
    }
    return next(new AppError('Donation record not found or already processed', 404));
  }

  // Check if this is the user's first successful donation to this campaign
  const previousDonationsCount = await Donation.countDocuments({
    user: req.user._id,
    campaign: campaignId,
    status: 'successful',
    _id: { $ne: donation._id } // Exclude the one we just updated
  });

  const isFirstDonation = previousDonationsCount === 0;

  // Update campaign total atomically
  const updateQuery = { $inc: { raisedAmount: donation.amount } };
  if (isFirstDonation) {
    updateQuery.$inc.donorsCount = 1;
  }

  const campaign = await Campaign.findByIdAndUpdate(
    campaignId,
    updateQuery,
    { new: true }
  );

  // Create notification for campaign creator
  if (campaign.creator.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: campaign.creator,
      sender: req.user._id,
      campaign: campaign._id,
      title: 'New Donation',
      message: `${req.user.name} donated ₹${donation.amount} to your campaign "${campaign.title}"`,
      type: 'donation',
      amount: donation.amount
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Payment verified successfully',
    data: { donation }
  });
});

export const getCampaignDonations = catchAsync(async (req, res, next) => {
  const { campaignId } = req.params;
  const donations = await Donation.find({ campaign: campaignId, status: 'successful' })
    .sort({ createdAt: -1 })
    .populate('user', 'name avatar');

  res.status(200).json({ status: 'success', results: donations.length, data: { donations } });
});

export const getUserDonations = catchAsync(async (req, res, next) => {
  const donations = await Donation.find({ user: req.user._id, status: 'successful' })
    .sort({ createdAt: -1 })
    .populate('campaign', 'title category media');

  res.status(200).json({ status: 'success', results: donations.length, data: { donations } });
});

export const downloadReceipt = catchAsync(async (req, res, next) => {
  const { donationId } = req.params;
  
  const donation = await Donation.findOne({ _id: donationId, user: req.user._id, status: 'successful' })
    .populate('campaign', 'title')
    .populate('user', 'name email');

  if (!donation) {
    return next(new AppError('Donation receipt not found', 404));
  }

  // For simplicity, returning receipt data as JSON. 
  // In a real app, this could generate a PDF using libraries like pdfkit and return a download stream.
  res.status(200).json({
    status: 'success',
    data: {
      receipt: {
        receiptNo: donation._id,
        date: donation.updatedAt,
        donor: donation.user.name,
        donorEmail: donation.user.email,
        campaign: donation.campaign.title,
        amount: donation.amount,
        transactionId: donation.razorpay_payment_id
      }
    }
  });
});
