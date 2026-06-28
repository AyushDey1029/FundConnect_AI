import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { logout } from '../store/authSlice.js';
import apiClient from '../services/apiClient.js';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        setProfileData(response.data.data.user);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-gray-900 dark:text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-8"
      >
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-bold overflow-hidden">
            {profileData?.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profileData?.name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileData?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{profileData?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full uppercase tracking-wide">
              {profileData?.role}
            </span>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About Me</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {profileData?.bio || "This user hasn't added a bio yet."}
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="font-medium text-gray-900 dark:text-white">{profileData?.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
              <p className="font-medium text-blue-600 dark:text-blue-400 truncate">
                {profileData?.website ? <a href={profileData.website} target="_blank" rel="noreferrer">{profileData.website}</a> : 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex space-x-4">
          <button 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            onClick={() => alert("Settings coming soon!")}
          >
            Edit Profile
          </button>
          <button 
            className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors font-medium"
            onClick={() => dispatch(logout())}
          >
            Log Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
