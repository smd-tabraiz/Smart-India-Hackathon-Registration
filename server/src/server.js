const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// Initialize DB connection
connectDB();

const app = express();

// Security Middlewares with ngrok & Mobile flexibility
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow inline styles and external scripts over ngrok
  })
);

// Dynamic CORS allowing Localhost, Mobile IPs & any ngrok domain
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('ngrok-free.app') ||
        origin.includes('ngrok-free.dev') ||
        origin.includes('ngrok.io') ||
        origin === process.env.CLIENT_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow for smooth mobile web access
    },
    credentials: true,
  })
);

// Trust proxy for ngrok & reverse proxies
app.set('trust proxy', 1);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs for high mobile traffic
  validate: { xForwardedForHeader: false },
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/spreadsheet', require('./routes/spreadsheetRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5005;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
