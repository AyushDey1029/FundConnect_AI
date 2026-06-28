import Report from '../models/report.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const createReport = catchAsync(async (req, res, next) => {
  const { reason, description, reportedItem, onModel } = req.body;

  if (!reportedItem || !onModel) {
    return next(new AppError('Reported item and model type are required', 400));
  }

  const report = await Report.create({
    user: req.user._id,
    reason,
    description,
    reportedItem,
    onModel
  });

  res.status(201).json({
    status: 'success',
    message: 'Report submitted successfully',
    data: { report }
  });
});
