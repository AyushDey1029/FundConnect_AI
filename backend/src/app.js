import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import donationRoutes from './routes/donation.routes.js';
import commentRoutes from './routes/comment.routes.js';
import likeRoutes from './routes/like.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import reportRoutes from './routes/report.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
        
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);

        // Allow specific origins from env
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }

        // Allow Vercel preview deployments dynamically
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // Allow localhost for development
        if (origin.startsWith('http://localhost:')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// API Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FundConnect AI API' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/campaigns/:campaignId/comments', commentRoutes);
app.use('/api/v1/campaigns/:campaignId/likes', likeRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
