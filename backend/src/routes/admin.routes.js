import express from 'express';
import { 
  getAllUsers, verifyUser, banUser, unbanUser,
  getAllCampaigns, verifyCampaign, rejectCampaign, softDeleteCampaign,
  getReports, resolveReport, 
  getWithdrawals, approveWithdrawal,
  getDashboardStats
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

// Dashboard Stats
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.patch('/users/:id/verify', verifyUser);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);

// Campaigns
router.get('/campaigns', getAllCampaigns);
router.patch('/campaigns/:id/verify', verifyCampaign);
router.patch('/campaigns/:id/reject', rejectCampaign);
router.delete('/campaigns/:id', softDeleteCampaign);

// Reports
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);

// Withdrawals
router.get('/withdrawals', getWithdrawals);
router.patch('/withdrawals/:id/approve', approveWithdrawal);

export default router;
