import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead); // use 'all' as ID to mark all as read
router.delete('/:id', deleteNotification);

export default router;
