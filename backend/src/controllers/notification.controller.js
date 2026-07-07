import Notification from '../models/notification.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .populate('sender', 'name profilePicture')
    .populate('campaign', 'title _id')
    .limit(20);

  res.status(200).json({ status: 'success', results: notifications.length, data: { notifications } });
});

export const markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );
  res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
});

export const markAsRead = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({ status: 'success', message: 'Notification marked as read' });
});

export const deleteNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndDelete({ _id: id, recipient: req.user._id });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(204).json({ status: 'success', data: null });
});
