import express from 'express';
import { addComment, getComments } from '../controllers/comment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { addCommentValidator } from '../validators/comment.validator.js';

const router = express.Router({ mergeParams: true });

router.post('/', protect, addCommentValidator, validate, addComment);
router.get('/', getComments);

export default router;
