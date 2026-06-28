import Notification from '../models/notification.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50); // Get latest 50

  res.status(200).json({ status: 'success', results: notifications.length, data: { notifications } });
});

export const markAsRead = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id === 'all') {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
  } else {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }
  }

  res.status(200).json({ status: 'success', message: 'Notification(s) marked as read' });
});

export const deleteNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndDelete({ _id: id, user: req.user._id });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(204).json({ status: 'success', data: null });
});
