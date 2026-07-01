import React, { useState } from 'react';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import apiClient from '../../services/apiClient';

const AIWriterAssistant = ({ content, onUpdateContent, promptParams }) => {
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [mode, setMode] = useState('rewrite');
  const [error, setError] = useState('');
  
  const options = [
    { value: 'grammar', label: 'Improve Grammar' },
    { value: 'rewrite', label: 'Rewrite' },
    { value: 'professional', label: 'Professional Tone' },
    { value: 'emotional', label: 'Emotional Tone' },
    { value: 'shorten', label: 'Shorten' },
    { value: 'expand', label: 'Expand' },
    { value: 'generate', label: 'Generate From Scratch' },
  ];

  const handleGenerate = async () => {
    if (!content && mode !== 'generate') {
      setError('Please provide some text to rewrite, or select "Generate From Scratch".');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await apiClient.post('/ai/rewrite', {
        content,
        mode,
        promptParams
      });
      setGeneratedText(response.data.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate text.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onUpdateContent(generatedText);
    setGeneratedText('');
  };

  return (
    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4 mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-medium text-gray-900 dark:text-white">AI Writer Assistant</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select 
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors outline-none"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Generate
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {generatedText && (
        <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-fade-in-up">
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
            {generatedText}
          </p>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Apply to Description
            </button>
            <button
              type="button"
              onClick={() => setGeneratedText('')}
              className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 mr-1.5" />
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWriterAssistant;
