import User from '../models/User.model.js';
import Campaign from '../models/campaign.model.js';
import Report from '../models/report.model.js';
import Withdrawal from '../models/withdrawal.model.js';
import Notification from '../models/notification.model.js';
import Donation from '../models/donation.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', results: users.length, data: { users } });
});

export const verifyUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
  res.status(200).json({ status: 'success', data: { user } });
});

export const banUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
  res.status(200).json({ status: 'success', data: { user } });
});

export const getAllCampaigns = catchAsync(async (req, res, next) => {
  const campaigns = await Campaign.find({ deletedAt: null }).sort({ createdAt: -1 }).populate('creator', 'name email');
  res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
});

export const verifyCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id, 
    { verificationStatus: 'verified', status: 'active' }, 
    { new: true }
  ).populate('creator');
  
  if (campaign) {
    await Notification.create({
      recipient: campaign.creator._id,
      title: 'Campaign Approved',
      message: `Your campaign "${campaign.title}" has been approved!`,
      type: 'campaign_approval',
      campaign: campaign._id
    });
  }

  res.status(200).json({ status: 'success', data: { campaign } });
});

export const getReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find().sort({ createdAt: -1 }).populate('user', 'name');
  res.status(200).json({ status: 'success', results: reports.length, data: { reports } });
});

export const resolveReport = catchAsync(async (req, res, next) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
  res.status(200).json({ status: 'success', data: { report } });
});

export const getWithdrawals = catchAsync(async (req, res, next) => {
  const withdrawals = await Withdrawal.find().sort({ createdAt: -1 }).populate('campaign user');
  res.status(200).json({ status: 'success', results: withdrawals.length, data: { withdrawals } });
});

export const approveWithdrawal = catchAsync(async (req, res, next) => {
  const withdrawal = await Withdrawal.findByIdAndUpdate(
    req.params.id, 
    { status: 'approved', approvedDate: Date.now() }, 
    { new: true }
  ).populate('user campaign');

  if (withdrawal) {
    await Notification.create({
      recipient: withdrawal.user._id,
      title: 'Withdrawal Approved',
      message: `Your withdrawal request for ₹${withdrawal.amount} has been approved.`,
      type: 'withdrawal_approval',
      amount: withdrawal.amount,
      campaign: withdrawal.campaign._id
    });
  }

  res.status(200).json({ status: 'success', data: { withdrawal } });
});

export const unbanUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
  res.status(200).json({ status: 'success', data: { user } });
});

export const rejectCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id, 
    { verificationStatus: 'rejected', status: 'cancelled' }, 
    { new: true }
  ).populate('creator');
  
  if (campaign) {
    await Notification.create({
      recipient: campaign.creator._id,
      title: 'Campaign Rejected',
      message: `Your campaign "${campaign.title}" has been rejected.`,
      type: 'system',
      campaign: campaign._id
    });
  }

  res.status(200).json({ status: 'success', data: { campaign } });
});

export const softDeleteCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { deletedAt: Date.now(), status: 'cancelled' },
    { new: true }
  );
  res.status(200).json({ status: 'success', data: null });
});

export const getDashboardStats = catchAsync(async (req, res, next) => {
  const usersCount = await User.countDocuments();
  const campaignsCount = await Campaign.countDocuments({ deletedAt: null });
  const activeCampaignsCount = await Campaign.countDocuments({ status: 'active', deletedAt: null });
  
  const donations = await Donation.aggregate([
    { $match: { status: 'successful' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const donationsTotal = donations.length > 0 ? donations[0].total : 0;

  const recentCampaigns = await Campaign.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(5).populate('creator', 'name email');
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

  res.status(200).json({
    status: 'success',
    data: {
      stats: { usersCount, campaignsCount, activeCampaignsCount, donationsTotal },
      recentCampaigns,
      recentUsers
    }
  });
});
