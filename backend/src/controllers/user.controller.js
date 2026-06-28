import User from '../models/User.model.js';
import Campaign from '../models/campaign.model.js';
import Donation from '../models/donation.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { uploadToCloudinary } from '../services/cloudinary.service.js';

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ status: 'success', data: { user } });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, bio, location, website } = req.body;
  
  const updateData = { name, bio, location, website };

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'avatars');
    updateData.profilePicture = result.secure_url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

export const toggleSaveCampaign = catchAsync(async (req, res, next) => {
  const { campaignId } = req.params;
  const user = await User.findById(req.user._id);

  const isSaved = user.savedCampaigns.includes(campaignId);

  if (isSaved) {
    user.savedCampaigns.pull(campaignId);
  } else {
    user.savedCampaigns.push(campaignId);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ 
    status: 'success', 
    message: isSaved ? 'Campaign removed from saved' : 'Campaign saved',
    data: { savedCampaigns: user.savedCampaigns }
  });
});

export const getSavedCampaigns = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('savedCampaigns');
  res.status(200).json({ status: 'success', results: user.savedCampaigns.length, data: { campaigns: user.savedCampaigns } });
});

export const getMyCampaigns = catchAsync(async (req, res, next) => {
  const campaigns = await Campaign.find({ creator: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
});

export const getDonationHistory = catchAsync(async (req, res, next) => {
  const donations = await Donation.find({ user: req.user._id, status: 'successful' })
    .sort({ createdAt: -1 })
    .populate('campaign', 'title category media status');

  res.status(200).json({ status: 'success', results: donations.length, data: { donations } });
});
