import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Heart, Share2 } from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Progress from '../ui/Progress';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

const CampaignCard = ({ campaign }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  if (!campaign) return null;

  const coverMedia = campaign.media?.[0]?.url || 'https://via.placeholder.com/600x400';
  const percentage = Math.min(100, Math.max(0, ((campaign.raisedAmount || 0) / campaign.goalAmount) * 100));
  const isCreator = isAuthenticated && user?._id === (campaign.creator?._id || campaign.creator);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto mb-8"
    >
      <Card className="h-full shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden border-gray-100 dark:border-gray-800">
        
        {/* 1. Large Media */}
        <Link to={`/campaigns/${campaign._id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={coverMedia} 
            alt={campaign.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {campaign.trustScore && (
            <div className="absolute top-4 left-4">
              <Badge variant="green" className="shadow-sm backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-green-100 dark:border-green-900">
                Trust Score: {campaign.trustScore.score}
              </Badge>
            </div>
          )}
        </Link>

        <div className="p-6">
          {/* 3. Category (Badge) & 2. Title */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="blue" className="px-3 py-1 font-semibold tracking-wide">
                {campaign.category}
              </Badge>
              {campaign.location && (
                <span className="flex items-center text-xs text-gray-500 font-medium">
                  <MapPin className="w-3 h-3 mr-1" />
                  {campaign.location}
                </span>
              )}
            </div>
            
            <Link to={`/campaigns/${campaign._id}`}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {campaign.title}
              </h2>
            </Link>
          </div>

          {/* 6. Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
            {campaign.description}
          </p>

          {/* 4. Progress & 5. Amount Raised / Goal */}
          <div className="mb-6 space-y-3">
            <div className="flex justify-between items-end">
              <div className="text-gray-900 dark:text-white">
                <span className="text-2xl font-extrabold tracking-tight">₹{(campaign.raisedAmount || 0).toLocaleString()}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1 font-medium">raised</span>
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {Math.round(percentage)}%
              </div>
            </div>
            <Progress value={percentage} className="h-2.5" />
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 pt-1">
              <span>Goal: ₹{campaign.goalAmount?.toLocaleString()}</span>
              <span>{campaign.donorsCount || 0} donors</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

          {/* 7. Creator & 8. Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar 
                src={campaign.creator?.profilePicture} 
                fallback={campaign.creator?.name || campaign.creator?.firstName} 
                size="sm" 
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Organized by</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {campaign.creator?.name || campaign.creator?.firstName || 'Anonymous'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <Share2 className="w-4 h-4" />
              </Button>
              {isCreator ? (
                <Button size="sm" className="px-5 font-semibold shadow-sm" disabled>
                  Your Campaign
                </Button>
              ) : (
                <Link to={`/campaigns/${campaign._id}`}>
                  <Button size="sm" className="px-5 font-semibold shadow-sm shadow-blue-500/10">Support</Button>
                </Link>
              )}
            </div>
          </div>
          
        </div>
      </Card>
    </motion.div>
  );
};

export default CampaignCard;
