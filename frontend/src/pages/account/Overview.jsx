import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Shield, Calendar, Edit } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Overview = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  }) : 'Recently Joined';

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 relative overflow-hidden bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar 
              src={user.profilePicture} 
              fallback={user.name} 
              size="xl" 
              className="w-24 h-24 border-4 border-white dark:border-gray-900 shadow-md"
            />
            {user.isVerified && (
              <span className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 shadow border-2 border-white dark:border-gray-900">
                <Shield className="w-4 h-4 fill-white" />
              </span>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 justify-center md:justify-start">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <div className="flex justify-center gap-2">
                  <Badge variant="blue" className="text-xs uppercase font-semibold">
                    {user.role}
                  </Badge>
                  {user.isVerified && (
                    <Badge variant="green" className="text-xs font-semibold">
                      Verified User
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
            </div>

            {/* Bio section with Empty State Handling */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">About Me</h3>
              {user.bio ? (
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                  No bio added yet. Click edit profile in Settings to share your story!
                </p>
              )}
            </div>

            {/* Metadata (Location, Website, Join Date) */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                Joined {joinDate}
              </span>
              
              {user.location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                  {user.location}
                </span>
              )}

              {user.website && (
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-1.5 text-gray-400" />
                  <a 
                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {user.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </span>
              )}
            </div>
          </div>

          {/* Edit Shortcut Button */}
          <Link to="/account/settings" className="absolute top-6 right-6">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Saved Campaigns Stat */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Bookmarked</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {user.savedCampaigns?.length || 0}
            </span>
            <span className="text-sm font-medium text-gray-500">campaigns</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Campaigns you are currently saving/following.</p>
        </div>
        
        {/* Help Tip Stat Box */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm sm:col-span-2 lg:col-span-2 flex flex-col justify-center">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Need help or want to start a campaign?</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            You can manage all campaigns you have launched under the "My Campaigns" tab. To create a new fundraising campaign, click the start button.
          </p>
          <div className="mt-4 flex gap-3">
            <Link to="/campaigns/create">
              <Button size="sm">Start Campaign</Button>
            </Link>
            <Link to="/">
              <Button size="sm" variant="outline">Browse Feed</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
