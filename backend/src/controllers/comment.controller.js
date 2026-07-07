import Comment from '../models/comment.model.js';
import Campaign from '../models/campaign.model.js';
import Notification from '../models/notification.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const addComment = catchAsync(async (req, res, next) => {
  const { campaignId } = req.params;
  const { text, parentCommentId } = req.body;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return next(new AppError('No campaign found with that ID', 404));
  }

  if (parentCommentId) {
    const parent = await Comment.findById(parentCommentId);
    if (!parent) return next(new AppError('Parent comment not found', 404));
  }

  const comment = await Comment.create({
    user: req.user._id,
    campaign: campaignId,
    text,
    parentCommentId: parentCommentId || null
  });

  if (campaign.creator.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: campaign.creator,
      sender: req.user._id,
      campaign: campaign._id,
      title: 'New Comment',
      message: `${req.user.name} commented on your campaign "${campaign.title}"`,
      type: 'comment'
    });
  }

  res.status(201).json({ status: 'success', data: { comment } });
});

export const getComments = catchAsync(async (req, res, next) => {
  const { campaignId } = req.params;

  const comments = await Comment.find({ campaign: campaignId })
    .sort({ createdAt: -1 })
    .populate('user', 'name avatar');

  res.status(200).json({ status: 'success', results: comments.length, data: { comments } });
});
