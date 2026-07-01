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
  const { content, mode = 'rewrite', promptParams } = req.body;
  
  if (!content && mode !== 'generate') {
    return next(new AppError('Content is required for this mode', 400));
  }

  let prompt = '';
  
  switch (mode) {
    case 'grammar':
      prompt = `Fix all grammar, spelling, and punctuation errors in the following crowdfunding campaign description. Maintain the original tone and meaning exactly.\n\nOriginal Content:\n${content}`;
      break;
    case 'professional':
      prompt = `Rewrite the following crowdfunding campaign description to have a highly professional, formal, and trustworthy tone suitable for corporate sponsors or serious investors.\n\nOriginal Content:\n${content}`;
      break;
    case 'emotional':
      prompt = `Rewrite the following crowdfunding campaign description to be highly emotional, empathetic, and compelling, connecting deeply with the reader's heart to encourage donations.\n\nOriginal Content:\n${content}`;
      break;
    case 'shorten':
      prompt = `Shorten the following crowdfunding campaign description to be concise and punchy while retaining all essential facts and the core call to action.\n\nOriginal Content:\n${content}`;
      break;
    case 'expand':
      prompt = `Expand the following crowdfunding campaign description. Add plausible, engaging details that elaborate on the cause, the impact of the donations, and why it matters, without changing the core facts.\n\nOriginal Content:\n${content}`;
      break;
    case 'generate':
      prompt = `Write a compelling crowdfunding campaign description from scratch based on the following details. Make it engaging, structured, and persuasive.\n\nDetails:\nTitle: ${promptParams?.title || 'N/A'}\nCategory: ${promptParams?.category || 'N/A'}\nGoal Amount: ${promptParams?.goalAmount || 'N/A'}\nKey Points: ${content || 'N/A'}`;
      break;
    case 'rewrite':
    default:
      prompt = `Rewrite and improve the following crowdfunding campaign description to make it more compelling, structured, and persuasive. Keep the core facts the same.\n\nOriginal Content:\n${content}`;
      break;
  }

  const generatedContent = await generateAIResponse(prompt);

  res.status(200).json({
    status: 'success',
    data: {
      content: generatedContent.trim(),
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
