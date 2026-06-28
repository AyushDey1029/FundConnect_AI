import { body } from 'express-validator';

export const addCommentValidator = [
  body('text').trim().notEmpty().withMessage('Comment text is required'),
  body('parentCommentId').optional().isMongoId().withMessage('Invalid parent comment ID'),
];
