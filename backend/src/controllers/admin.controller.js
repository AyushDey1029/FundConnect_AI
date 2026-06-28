import User from '../models/User.model.js';
import Campaign from '../models/campaign.model.js';
import Report from '../models/report.model.js';
import Withdrawal from '../models/withdrawal.model.js';
import Notification from '../models/notification.model.js';
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
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).populate('creator', 'name email');
  res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
});

export const verifyCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id, 
    { isVerified: true, status: 'approved' }, 
    { new: true }
  ).populate('creator');
  
  if (campaign) {
    await Notification.create({
      user: campaign.creator._id,
      message: `Your campaign "${campaign.title}" has been approved!`,
      type: 'campaign_approval',
      relatedItem: campaign._id,
      onModel: 'Campaign'
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
      user: withdrawal.user._id,
      message: `Your withdrawal request for ₹${withdrawal.amount} has been approved.`,
      type: 'withdrawal_approval',
      relatedItem: withdrawal._id,
      onModel: 'Withdrawal'
    });
  }

  res.status(200).json({ status: 'success', data: { withdrawal } });
});
