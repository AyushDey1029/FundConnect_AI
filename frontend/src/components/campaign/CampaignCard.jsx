import React from 'react';
import { Card } from '../ui/Card';
import CampaignHeader from './CampaignHeader';
import CampaignMedia from './CampaignMedia';
import CampaignProgress from './CampaignProgress';
import CampaignActions from './CampaignActions';
import CampaignFooter from './CampaignFooter';

const CampaignCard = ({ campaign }) => {
  if (!campaign) return null;

  return (
    <Card className="max-w-2xl mx-auto w-full mb-6">
      <CampaignHeader 
        creator={campaign.creator}
        createdAt={campaign.createdAt}
        category={campaign.category}
        title={campaign.title}
      />
      
      <CampaignMedia 
        media={campaign.media} 
        title={campaign.title} 
        trustScore={campaign.trustScore}
      />
      
      <CampaignProgress 
        goalAmount={campaign.goalAmount}
        raisedAmount={campaign.raisedAmount}
        title={campaign.title}
        description={campaign.description}
      />
      
      <CampaignActions campaignId={campaign._id} creatorId={campaign.creator?._id || campaign.creator} />
      
      <CampaignFooter 
        likesCount={Math.floor(Math.random() * 50)} // Mock for now until API returns it
        commentsCount={Math.floor(Math.random() * 20)}
      />
    </Card>
  );
};

export default CampaignCard;
