import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Upload, X, Megaphone } from 'lucide-react';
import apiClient from '../../services/apiClient';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/formatDate';

const CampaignUpdates = ({ campaignId, creatorId }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewMedia, setPreviewMedia] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const isCreator = isAuthenticated && user?._id === creatorId;

  useEffect(() => {
    fetchUpdates();
  }, [campaignId]);

  const fetchUpdates = async () => {
    try {
      const response = await apiClient.get(`/campaigns/${campaignId}/updates`);
      setUpdates(response.data.data.updates);
    } catch (err) {
      console.error('Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (mediaFiles.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    setMediaFiles([...mediaFiles, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewMedia([...previewMedia, ...previews]);
  };

  const removeMedia = (index) => {
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);
    
    const newPreviews = [...previewMedia];
    newPreviews.splice(index, 1);
    setPreviewMedia(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('description', description);
      mediaFiles.forEach(file => {
        data.append('media', file);
      });

      await apiClient.post(`/campaigns/${campaignId}/updates`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setTitle('');
      setDescription('');
      setMediaFiles([]);
      setPreviewMedia([]);
      setShowForm(false);
      fetchUpdates();
    } catch (err) {
      alert('Failed to post update');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading updates...</div>;

  return (
    <div className="space-y-8">
      
      {/* Creator Form */}
      {isCreator && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6 mb-8">
          {!showForm ? (
            <div className="text-center">
              <Megaphone className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Post an Update</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Keep your supporters in the loop with the latest news.</p>
              <Button onClick={() => setShowForm(true)}>Write Update</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">New Update</h3>
              
              <input
                type="text"
                placeholder="Update Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              
              <textarea
                placeholder="What's new?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Images
                  <input type="file" className="hidden" multiple accept="image/*" onChange={handleMediaUpload} />
                </label>
                <p className="text-xs text-gray-500 mt-2">Up to 5 images</p>
              </div>

              {previewMedia.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {previewMedia.map((url, idx) => (
                    <div key={idx} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" isLoading={submitting} disabled={!title.trim() || !description.trim()}>Post Update</Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Updates Timeline */}
      {updates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No updates yet.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-blue-100 dark:border-blue-900/50 ml-4 md:ml-6 space-y-12 pb-8">
          {updates.map((update) => (
            <div key={update._id} className="relative pl-6 md:pl-8">
              {/* Timeline dot */}
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-1 border-4 border-white dark:border-gray-950"></div>
              
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar size="sm" src={update.creator?.profilePicture} />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm block">
                      {update.creator?.firstName} {update.creator?.lastName}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(update.createdAt)}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{update.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">{update.description}</p>
                
                {update.media && update.media.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {update.media.map((mediaObj, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
                        <img src={mediaObj.url} alt="Update media" className="w-full h-full object-cover" style={{ objectPosition: mediaObj.objectPosition || '50% 50%' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignUpdates;
