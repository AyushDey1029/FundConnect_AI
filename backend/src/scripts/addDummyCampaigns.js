import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from '../models/user.model.js';
import Campaign from '../models/campaign.model.js';

dotenv.config();

const addDummyCampaigns = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Find any user to assign campaigns to
    let user = await User.findOne();
    if (!user) {
      console.log('No user found, creating a dummy user...');
      user = await User.create({
        name: 'Dummy User',
        email: faker.internet.email(),
        password: 'password123',
        role: 'user',
      });
    }

    const categories = ['Medical', 'Education', 'Startup', 'Environment', 'Animal Welfare', 'NGO', 'Disaster Relief', 'Other'];
    const campaignsToCreate = [];

    for (let i = 0; i < 10; i++) {
      const goalAmount = faker.number.int({ min: 10000, max: 500000 });
      const raisedAmount = faker.number.int({ min: 0, max: goalAmount });

      campaignsToCreate.push({
        creator: user._id,
        title: faker.lorem.words({ min: 4, max: 7 }),
        description: faker.lorem.paragraphs(2),
        goalAmount,
        raisedAmount,
        deadline: faker.date.future({ years: 1 }),
        category: faker.helpers.arrayElement(categories),
        media: [{
          url: faker.image.urlLoremFlickr({ category: 'nature' }),
          type: 'image',
          objectPosition: '50% 50%'
        }],
        status: 'active',
        verificationStatus: 'verified',
        donorsCount: faker.number.int({ min: 0, max: 100 }),
      });
    }

    const created = await Campaign.insertMany(campaignsToCreate);
    console.log(`Successfully added ${created.length} dummy campaigns!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addDummyCampaigns();
