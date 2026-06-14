const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// CLIENT_URL can be one URL or a comma-separated list (e.g. for multiple deployed frontends).
// Any http://localhost:PORT origin is always allowed, so it doesn't matter which port
// your React dev server ends up using (3000, 5176, etc.) - it just works.
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser requests (curl, server-to-server)
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true); // any local dev port
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' })); // 10mb limit to allow base64 images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Social App API is running ✅');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Exported so this app can also be used as a Vercel serverless function
module.exports = app;
