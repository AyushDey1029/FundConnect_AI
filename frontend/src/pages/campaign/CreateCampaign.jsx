import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Upload, X, ChevronRight, Check } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AIWriterAssistant from '../../components/campaign/AIWriterAssistant';
import CampaignCard from '../../components/campaign/CampaignCard';
import DraggableImage from '../../components/ui/DraggableImage';
import apiClient from '../../services/apiClient';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    goalAmount: '',
    endDate: '',
    description: '',
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewMedia, setPreviewMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Update live preview object
  const livePreviewData = {
    _id: 'preview',
    title: formData.title || 'Your Campaign Title',
    category: formData.category || 'Category',
    goalAmount: formData.goalAmount || 10000,
    raisedAmount: 0,
    description: formData.description || 'Campaign description will appear here...',
    createdAt: new Date().toISOString(),
    creator: user || { firstName: 'You', lastName: '' },
    media: previewMedia.length > 0 ? previewMedia.map(f => ({ url: f.url, type: f.type.startsWith('video') ? 'video' : 'image', objectPosition: f.objectPosition || '50% 50%' })) : [],
    trustScore: { score: 100, explanation: 'Preview' }
  };

  const categories = ['Medical', 'Education', 'Startup', 'Environment', 'Animal Welfare', 'NGO', 'Disaster Relief', 'Technology', 'Creative', 'Community', 'Health', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check validation: Up to 5 images OR 1 video
    let hasVideo = false;
    let imgCount = 0;
    
    const validFiles = files.filter(f => {
      if (f.type.startsWith('video/')) {
        hasVideo = true;
        return true;
      } else if (f.type.startsWith('image/')) {
        imgCount++;
        return true;
      }
      return false;
    });

    if (hasVideo && (validFiles.length > 1 || mediaFiles.length > 0)) {
      setError('You can only upload 1 video, and it cannot be mixed with images.');
      return;
    }
    if (imgCount + mediaFiles.length > 5) {
      setError('You can only upload up to 5 images.');
      return;
    }
    
    setError('');
    const newFiles = [...mediaFiles, ...validFiles];
    setMediaFiles(newFiles);
    
    // Generate previews
    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      objectPosition: '50% 50%'
    }));
    setPreviewMedia([...previewMedia, ...newPreviews]);
  };

  const removeMedia = (index) => {
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);
    
    const newPreviews = [...previewMedia];
    newPreviews.splice(index, 1);
    setPreviewMedia(newPreviews);
  };

  const updateMediaPosition = (index, position) => {
    const newPreviews = [...previewMedia];
    newPreviews[index].objectPosition = position;
    setPreviewMedia(newPreviews);
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.title || !formData.category || !formData.goalAmount || !formData.endDate) {
        setError('Please fill in all basic information fields.');
        return;
      }
    } else if (step === 2) {
      if (!formData.description) {
        setError('Please provide a campaign description.');
        return;
      }
    } else if (step === 3) {
      if (mediaFiles.length === 0) {
        setError('Please upload at least one image or video.');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('goalAmount', formData.goalAmount);
      data.append('deadline', formData.endDate);
      data.append('description', formData.description);
      
      mediaFiles.forEach(file => {
        data.append('media', file);
      });

      const mediaMeta = previewMedia.map(m => ({
        type: m.type.startsWith('video') ? 'video' : 'image',
        objectPosition: m.objectPosition || '50% 50%'
      }));
      data.append('mediaMeta', JSON.stringify(mediaMeta));

      const response = await apiClient.post('/campaigns', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate(`/campaigns/${response.data.data.campaign._id}`);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors.map(e => Object.values(e)[0]).join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.message || 'Failed to create campaign. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 pt-16">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Form Wizard */}
        <div className="flex-1 lg:max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create a Campaign</h1>
            
            {/* Step Indicators */}
            <div className="flex items-center space-x-2 text-sm font-medium">
              <span className={step >= 1 ? 'text-blue-600' : 'text-gray-400'}>1. Basic Info</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className={step >= 2 ? 'text-blue-600' : 'text-gray-400'}>2. Story & AI</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className={step >= 3 ? 'text-blue-600' : 'text-gray-400'}>3. Media</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className={step >= 4 ? 'text-blue-600' : 'text-gray-400'}>4. Publish</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
            {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Title</label>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Save the local park" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Amount (₹)</label>
                    <Input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} placeholder="10000" min="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                    <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Story & AI */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tell your story</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows="8"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3 outline-none"
                    placeholder="Describe your cause, why it matters, and how the funds will be used..."
                  />
                  
                  <AIWriterAssistant 
                    content={formData.description} 
                    onUpdateContent={(newContent) => setFormData({...formData, description: newContent})}
                    promptParams={{ title: formData.title, category: formData.category, goalAmount: formData.goalAmount }}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Media Upload */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Media</h2>
                <p className="text-sm text-gray-500 mb-4">Upload up to 5 images OR 1 video. A compelling visual makes a huge difference.</p>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                    <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={handleMediaUpload} />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">MP4, JPG, PNG up to 10MB</p>
                </div>

                {previewMedia.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {previewMedia.map((media, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group">
                        {media.type.startsWith('video') ? (
                          <video src={media.url} className="w-full h-full object-cover" />
                        ) : (
                          <DraggableImage 
                            src={media.url} 
                            alt="Preview" 
                            initialPosition={media.objectPosition}
                            onPositionChange={(pos) => updateMediaPosition(idx, pos)} 
                          />
                        )}
                        <button 
                          type="button"
                          onClick={() => removeMedia(idx)}
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 shadow-md"
                          title="Remove Media"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Review & Publish</h2>
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-xl text-blue-800 dark:text-blue-300 text-sm">
                  <Check className="w-5 h-5 inline-block mr-2" />
                  You're all set! Review the live preview on the right. Once you publish, your campaign will be live and our AI will automatically evaluate its Trust Score.
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1 || isSubmitting}>
                Back
              </Button>
              {step < 4 ? (
                <Button type="button" onClick={handleNext}>
                  Next Step
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
                  Publish Campaign
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="hidden lg:block w-[500px] shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden p-2 hide-scrollbar">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Live Preview</h3>
          </div>
          <div className="pointer-events-none opacity-90 scale-95 origin-top">
            <CampaignCard campaign={livePreviewData} />
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default CreateCampaign;
