import { generateAIResponse } from '../services/openrouter.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Campaign from '../models/campaign.model.js';

export const evaluateCampaign = catchAsync(async (req, res, next) => {
  const { campaignId } = req.params;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return next(new AppError('Campaign not found', 404));
  }

  const prompt = `
    Evaluate the following crowdfunding campaign and provide a trust score from 0 to 100.
    Also provide a brief explanation for the score.
    Respond ONLY in valid JSON format with keys "score" (number) and "explanation" (string).

    Campaign Title: ${campaign.title}
    Category: ${campaign.category}
    Goal Amount: ${campaign.goalAmount}
    Description: ${campaign.description}
  `;

  const aiResponse = await generateAIResponse(prompt);
  let result;
  
  try {
    const jsonStr = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    result = JSON.parse(jsonStr);
  } catch (e) {
    return next(new AppError('Failed to parse AI response', 500));
  }

  campaign.trustScore = {
    score: result.score || 0,
    explanation: result.explanation || 'No explanation provided.',
  };

  await campaign.save();

  res.status(200).json({
    status: 'success',
    data: {
      trustScore: campaign.trustScore,
    },
  });
});

export const rewriteCampaign = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return next(new AppError('Content is required', 400));
  }

  const prompt = `
    Rewrite and improve the following crowdfunding campaign description to make it more compelling, professional, and persuasive. Keep the core facts the same.
    
    Original Content:
    ${content}
  `;

  const rewrittenContent = await generateAIResponse(prompt);

  res.status(200).json({
    status: 'success',
    data: {
      content: rewrittenContent.trim(),
    },
  });
});

export const summarizeCampaign = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return next(new AppError('Content is required', 400));
  }

  const prompt = `
    Provide a concise, 1-2 sentence summary of the following crowdfunding campaign description.
    
    Original Content:
    ${content}
  `;

  const summary = await generateAIResponse(prompt);

  res.status(200).json({
    status: 'success',
    data: {
      summary: summary.trim(),
    },
  });
});
