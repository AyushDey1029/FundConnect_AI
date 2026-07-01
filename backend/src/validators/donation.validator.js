import { body } from 'express-validator';

export const createDonationIntentValidator = [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 100 }).withMessage('Amount must be at least ₹100'),
];

export const verifyDonationValidator = [
  body('razorpay_order_id').trim().notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').trim().notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').trim().notEmpty().withMessage('Signature is required'),
];
