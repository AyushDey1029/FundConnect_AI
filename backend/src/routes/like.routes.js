import express from 'express';
import { toggleLike } from '../controllers/like.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true }); 
// mergeParams to allow nested routes like /campaigns/:campaignId/likes

router.post('/', protect, toggleLike);

export default router;
