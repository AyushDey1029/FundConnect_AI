import express from 'express';
import { 
  getAllUsers, verifyUser, banUser, 
  getAllCampaigns, verifyCampaign, 
  getReports, resolveReport, 
  getWithdrawals, approveWithdrawal 
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

// Users
router.get('/users', getAllUsers);
router.patch('/users/:id/verify', verifyUser);
router.patch('/users/:id/ban', banUser);

// Campaigns
router.get('/campaigns', getAllCampaigns);
router.patch('/campaigns/:id/verify', verifyCampaign);

// Reports
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);

// Withdrawals
router.get('/withdrawals', getWithdrawals);
router.patch('/withdrawals/:id/approve', approveWithdrawal);

export default router;
