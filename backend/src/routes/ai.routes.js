import express from 'express';
import { evaluateCampaign, rewriteCampaign, summarizeCampaign } from '../controllers/ai.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Only admin can trigger evaluation for now, or maybe internal system. 
// We'll protect it with restrictTo('admin')
router.post('/:campaignId/evaluate', protect, restrictTo('admin'), evaluateCampaign);

router.post('/rewrite', protect, rewriteCampaign);
router.post('/summarize', protect, summarizeCampaign);

export default router;
