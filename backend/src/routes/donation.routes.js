import express from 'express';
import { 
  createDonationIntent, verifyDonation, getCampaignDonations, 
  getUserDonations, downloadReceipt 
} from '../controllers/donation.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createDonationIntentValidator, verifyDonationValidator } from '../validators/donation.validator.js';

const router = express.Router({ mergeParams: true });

router.post('/intent', protect, createDonationIntentValidator, validate, createDonationIntent);
router.post('/verify', protect, verifyDonationValidator, validate, verifyDonation);
router.get('/campaign', getCampaignDonations);
router.get('/my-donations', protect, getUserDonations);
router.get('/:donationId/receipt', protect, downloadReceipt);

export default router;
