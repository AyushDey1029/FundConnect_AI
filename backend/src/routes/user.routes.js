import express from 'express';
import { 
  getProfile, updateProfile, toggleSaveCampaign, 
  getSavedCampaigns, getMyCampaigns, getDonationHistory 
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadMedia } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(protect); // All routes below are protected

router.get('/profile', getProfile);
router.put('/profile', uploadMedia.single('profilePicture'), updateProfile);
router.post('/saved-campaigns/:campaignId', toggleSaveCampaign);
router.get('/saved-campaigns', getSavedCampaigns);
router.get('/my-campaigns', getMyCampaigns);
router.get('/donation-history', getDonationHistory);

export default router;
