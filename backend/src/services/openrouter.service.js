import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const openRouterClient = axios.create({
  baseURL: OPENROUTER_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173', 
    'X-Title': 'FundConnect AI',
    'Content-Type': 'application/json'
  }
});

/**
 * Sends a prompt to the OpenRouter API (defaulting to Gemini 2.5 Flash)
 * @param {string} prompt - The system or user prompt.
 * @param {string} model - The model to use.
 * @returns {Promise<string>} The AI response text.
 */
export const generateAIResponse = async (prompt, model = 'google/gemini-2.5-flash') => {
  try {
    const response = await openRouterClient.post('', {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate AI response');
  }
};
