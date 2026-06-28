import multer from 'multer';
import AppError from '../utils/AppError.js';

// Store file in memory so we can upload it to Cloudinary as a buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image or video! Please upload only images or videos.', 400), false);
  }
};

export const uploadMedia = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  }
});
