import express from 'express';
import { 
  createCampaign, getTrendingCampaigns, getNewestCampaigns, getCampaignsByCategory, 
  getFeed, getCampaignById, updateCampaign, deleteCampaign, addCampaignUpdate, getCampaignUpdates,
  getMyCampaigns, getCampaignAnalytics
} from '../controllers/campaign.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadMedia } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createCampaignValidator, updateCampaignValidator, campaignUpdateValidator } from '../validators/campaign.validator.js';

const router = express.Router();

// Feeds
router.get('/trending', getTrendingCampaigns);
router.get('/newest', getNewestCampaigns);
router.get('/category/:category', getCampaignsByCategory);
router.get('/feed', getFeed);

// Core CRUD
router.get('/me', protect, getMyCampaigns);
router.post('/', protect, uploadMedia.array('media', 5), createCampaignValidator, validate, createCampaign);
router.get('/:id', getCampaignById);
router.get('/:id/analytics', protect, getCampaignAnalytics);
router.put('/:id', protect, uploadMedia.array('media', 5), updateCampaignValidator, validate, updateCampaign);
router.delete('/:id', protect, deleteCampaign);

// Updates
router.post('/:id/updates', protect, uploadMedia.array('media', 5), campaignUpdateValidator, validate, addCampaignUpdate);
router.get('/:id/updates', getCampaignUpdates);

export default router;
