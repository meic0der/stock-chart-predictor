module.exports = {
  port: process.env.PORT || 4010,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mlApiUrl: process.env.ML_API_URL || 'http://localhost:5000',
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',
  sessionMaxAge: 24 * 60 * 60 * 1000, // 24時間
}; 