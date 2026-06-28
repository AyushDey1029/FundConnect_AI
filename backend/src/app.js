import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/user.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
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
// app.use('/api/v1/users', userRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
