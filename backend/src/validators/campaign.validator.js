import { body } from 'express-validator';

export const createCampaignValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('goalAmount').isNumeric().withMessage('Goal amount must be a number').isFloat({ gt: 0 }).withMessage('Goal amount must be greater than 0'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('deadline').isISO8601().toDate().withMessage('Deadline must be a valid date'),
];

export const updateCampaignValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('goalAmount').optional().isNumeric().withMessage('Goal amount must be a number').isFloat({ gt: 0 }).withMessage('Goal amount must be greater than 0'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('deadline').optional().isISO8601().toDate().withMessage('Deadline must be a valid date'),
];

export const campaignUpdateValidator = [
  body('title').trim().notEmpty().withMessage('Update title is required').isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('Update description is required')
];
