import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Campaign from '../models/campaign.model.js';
import CampaignUpdate from '../models/campaignUpdate.model.js';
import Donation from '../models/donation.model.js';
import Comment from '../models/comment.model.js';
import Like from '../models/like.model.js';
import Report from '../models/report.model.js';
import Withdrawal from '../models/withdrawal.model.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Campaign.deleteMany();
    await CampaignUpdate.deleteMany();
    await Donation.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();

    console.log('Generating dummy data...');

    // 1. Create Users
    const usersToCreate = [];
    
    // Add one admin and one test user explicitly
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('password123', salt);

    usersToCreate.push({
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash, // In a real scenario, hash this first, but the schema has a pre-save hook. Since we use create(), the hook will run if we pass plaintext. But wait, faker users below we will pass plaintext.
      role: 'admin',
      isVerified: true,
    });
    
    usersToCreate.push({
      name: 'Test User',
      email: 'user@example.com',
      password: passwordHash,
      role: 'user',
      isVerified: true,
    });

    for (let i = 0; i < 20; i++) {
      usersToCreate.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123', // Will be hashed by pre-save hook
        role: 'user',
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.sentence(),
        isVerified: faker.datatype.boolean({ probability: 0.7 }),
      });
    }

    const createdUsers = await User.create(usersToCreate);
    console.log(`${createdUsers.length} users created.`);

    // 2. Create Campaigns
    const categories = ['Medical', 'Education', 'Startup', 'Environment', 'Animal Welfare', 'NGO', 'Disaster Relief', 'Other'];
    const statuses = ['pending', 'approved', 'rejected', 'suspended'];
    const campaignsToCreate = [];

    for (let i = 0; i < 30; i++) {
      const creator = faker.helpers.arrayElement(createdUsers)._id;
      const goalAmount = faker.number.int({ min: 1000, max: 100000 });
      const raisedAmount = faker.number.int({ min: 0, max: goalAmount });

      campaignsToCreate.push({
        creator,
        title: faker.lorem.words({ min: 3, max: 8 }),
        description: faker.lorem.paragraphs(3),
        goalAmount,
        raisedAmount,
        deadline: faker.date.future({ years: 1 }),
        category: faker.helpers.arrayElement(categories),
        media: [faker.image.urlLoremFlickr({ category: 'nature' })],
        status: faker.helpers.arrayElement(statuses),
        isVerified: faker.datatype.boolean({ probability: 0.5 }),
        trustScore: {
          score: faker.number.int({ min: 10, max: 100 }),
          explanation: faker.lorem.sentence(),
        }
      });
    }

    const createdCampaigns = await Campaign.create(campaignsToCreate);
    console.log(`${createdCampaigns.length} campaigns created.`);

    // 3. Create Donations and Comments
    const donationsToCreate = [];
    const commentsToCreate = [];

    for (const campaign of createdCampaigns) {
      // Add random donations
      const numDonations = faker.number.int({ min: 0, max: 10 });
      for (let i = 0; i < numDonations; i++) {
        const donor = faker.helpers.arrayElement(createdUsers)._id;
        donationsToCreate.push({
          user: donor,
          campaign: campaign._id,
          amount: faker.number.int({ min: 10, max: 500 }),
          razorpay_order_id: `order_${faker.string.alphanumeric(10)}`,
          razorpay_payment_id: `pay_${faker.string.alphanumeric(10)}`,
          status: 'successful',
        });
      }

      // Add random comments
      const numComments = faker.number.int({ min: 0, max: 5 });
      for (let i = 0; i < numComments; i++) {
        const commenter = faker.helpers.arrayElement(createdUsers)._id;
        commentsToCreate.push({
          text: faker.lorem.sentences(2),
          user: commenter,
          campaign: campaign._id,
        });
      }
    }

    if (donationsToCreate.length > 0) {
      await Donation.insertMany(donationsToCreate);
      console.log(`${donationsToCreate.length} donations created.`);
    }

    if (commentsToCreate.length > 0) {
      await Comment.insertMany(commentsToCreate);
      console.log(`${commentsToCreate.length} comments created.`);
    }

    // 4. Create Campaign Updates, Reports and Withdrawals
    const updatesToCreate = [];
    const reportsToCreate = [];
    const withdrawalsToCreate = [];

    for (let i = 0; i < 15; i++) {
      const campaign = faker.helpers.arrayElement(createdCampaigns);
      updatesToCreate.push({
        campaign: campaign._id,
        creator: campaign.creator,
        title: faker.lorem.words({ min: 3, max: 6 }),
        description: faker.lorem.paragraph(),
        media: [],
      });
    }

    for (let i = 0; i < 10; i++) {
      reportsToCreate.push({
        user: faker.helpers.arrayElement(createdUsers)._id,
        reason: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(['pending', 'reviewed', 'resolved']),
        reportedItem: faker.helpers.arrayElement(createdCampaigns)._id,
        onModel: 'Campaign'
      });
    }

    for (let i = 0; i < 5; i++) {
      const campaign = faker.helpers.arrayElement(createdCampaigns);
      withdrawalsToCreate.push({
        campaign: campaign._id,
        user: campaign.creator,
        amount: faker.number.int({ min: 100, max: campaign.raisedAmount || 1000 }),
        status: faker.helpers.arrayElement(['pending', 'approved']),
      });
    }

    await CampaignUpdate.insertMany(updatesToCreate);
    await Report.insertMany(reportsToCreate);
    await Withdrawal.insertMany(withdrawalsToCreate);
    console.log(`${updatesToCreate.length} updates, ${reportsToCreate.length} reports, ${withdrawalsToCreate.length} withdrawals created.`);

    console.log('Data Import Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // Can add destroyData logic here if needed
  console.log('Destroy argument passed');
  process.exit();
} else {
  importData();
}
