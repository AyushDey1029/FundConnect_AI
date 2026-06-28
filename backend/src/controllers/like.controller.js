import Like from '../models/like.model.js';
import Campaign from '../models/campaign.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const toggleLike = catchAsync(async (req, res, next) => {
  const { campaignId } = req.params;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return next(new AppError('No campaign found with that ID', 404));
  }

  const existingLike = await Like.findOne({ user: req.user._id, campaign: campaignId });

  if (existingLike) {
    await existingLike.deleteOne();
    return res.status(200).json({ status: 'success', message: 'Like removed' });
  }

  const newLike = await Like.create({
    user: req.user._id,
    campaign: campaignId,
  });

  res.status(201).json({ status: 'success', data: { like: newLike } });
});
