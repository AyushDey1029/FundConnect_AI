import Campaign from '../models/campaign.model.js';
import CampaignUpdate from '../models/campaignUpdate.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

export const createCampaign = catchAsync(async (req, res, next) => {
  const { title, description, goalAmount, category, deadline } = req.body;

  let mediaMeta = [];
  if (req.body.mediaMeta) {
    try {
      mediaMeta = JSON.parse(req.body.mediaMeta);
    } catch(e) {}
  }

  let mediaUrls = [];
  if (req.files && req.files.length > 0) {
    for (let i=0; i<req.files.length; i++) {
      const file = req.files[i];
      const result = await uploadToCloudinary(file.buffer, 'campaigns');
      let meta = mediaMeta[i] || { type: 'image', objectPosition: '50% 50%' };
      mediaUrls.push({
        url: result.secure_url,
        type: meta.type,
        objectPosition: meta.objectPosition
      });
    }
  }

  const campaign = await Campaign.create({
    creator: req.user._id,
    title,
    description,
    goalAmount,
    category,
    deadline,
    media: mediaUrls,
  });

  res.status(201).json({
    status: 'success',
    data: {
      campaign,
    },
  });
});

export const getTrendingCampaigns = catchAsync(async (req, res, next) => {
  // Mock trending logic: sort by raisedAmount and limit
  const campaigns = await Campaign.find({ 
    status: 'active', 
    deletedAt: null,
    $expr: { $lt: [{ $ifNull: ["$raisedAmount", 0] }, "$goalAmount"] }
  })
    .sort({ raisedAmount: -1 })
    .limit(10)
    .populate('creator', 'name avatar');

  res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
});

export const getNewestCampaigns = catchAsync(async (req, res, next) => {
  const campaigns = await Campaign.find({ 
    status: 'active', 
    deletedAt: null,
    $expr: { $lt: [{ $ifNull: ["$raisedAmount", 0] }, "$goalAmount"] }
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('creator', 'name avatar');

  res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
});

export const getCampaignsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const campaigns = await Campaign.find({ 
    category, 
    status: 'active', 
    deletedAt: null,
    $expr: { $lt: [{ $ifNull: ["$raisedAmount", 0] }, "$goalAmount"] }
  })
    .sort({ createdAt: -1 })
    .populate('creator', 'name avatar');

  res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
});

export const getFeed = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const campaigns = await Campaign.find({ 
    status: 'active', 
    deletedAt: null,
    $expr: { $lt: [{ $ifNull: ["$raisedAmount", 0] }, "$goalAmount"] }
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('creator', 'name avatar');

  res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
});

export const getCampaignById = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id).populate('creator', 'name avatar');
  
  if (!campaign) {
    return next(new AppError('No campaign found with that ID', 404));
  }

  res.status(200).json({ status: 'success', data: { campaign } });
});

export const updateCampaign = catchAsync(async (req, res, next) => {
  let campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(new AppError('No campaign found with that ID', 404));
  }

  if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to update this campaign', 403));
  }

  const { title, description, goalAmount, category, deadline } = req.body;

  let mediaMeta = [];
  if (req.body.mediaMeta) {
    try {
      mediaMeta = JSON.parse(req.body.mediaMeta);
    } catch(e) {}
  }

  let mediaUrls = campaign.media;
  if (req.files && req.files.length > 0) {
    // Optionally delete old media here
    mediaUrls = [];
    for (let i=0; i<req.files.length; i++) {
      const file = req.files[i];
      const result = await uploadToCloudinary(file.buffer, 'campaigns');
      let meta = mediaMeta[i] || { type: 'image', objectPosition: '50% 50%' };
      mediaUrls.push({
        url: result.secure_url,
        type: meta.type,
        objectPosition: meta.objectPosition
      });
    }
  }

  campaign.title = title || campaign.title;
  campaign.description = description || campaign.description;
  campaign.goalAmount = goalAmount || campaign.goalAmount;
  campaign.category = category || campaign.category;
  campaign.deadline = deadline || campaign.deadline;
  campaign.media = mediaUrls;

  await campaign.save();

  res.status(200).json({ status: 'success', data: { campaign } });
});

export const deleteCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(new AppError('No campaign found with that ID', 404));
  }

  if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this campaign', 403));
  }

  campaign.deletedAt = Date.now();
  await campaign.save();

  res.status(200).json({ status: 'success', data: null });
});

export const getMyCampaigns = catchAsync(async (req, res, next) => {
  const campaigns = await Campaign.find({ creator: req.user._id, deletedAt: null })
    .sort({ createdAt: -1 });

  res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
});

// Updates Handlers
export const addCampaignUpdate = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    return next(new AppError('No campaign found with that ID', 404));
  }

  if (campaign.creator.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the creator can post updates', 403));
  }

  const { title, description } = req.body;
  let mediaUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, 'updates');
      mediaUrls.push({
        url: result.secure_url,
        type: 'image', // Updates typically just handle images for now
        objectPosition: '50% 50%'
      });
    }
  }

  const update = await CampaignUpdate.create({
    campaign: campaign._id,
    creator: req.user._id,
    title,
    description,
    media: mediaUrls
  });

  res.status(201).json({ status: 'success', data: { update } });
});

export const getCampaignUpdates = catchAsync(async (req, res, next) => {
  const updates = await CampaignUpdate.find({ campaign: req.params.id })
    .sort({ createdAt: -1 })
    .populate('creator', 'name avatar');

  res.status(200).json({ status: 'success', results: updates.length, data: { updates } });
});
