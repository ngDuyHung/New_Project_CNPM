require('dotenv').config();
const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const practiceHistoryRoutes = require('./routes/practiceHistoryRoutes');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const db = require('./config/db');
const topicRoutes = require("./routes/topicRoutes"); 
const vocabRoutes = require("./routes/vocabularyRoutes"); 
const badgeRoutes = require('./routes/badgesRoutes');
const progressRoutes = require('./routes/progressRoutes');
const conversationalAIRoutes = require('./routes/conversationalAIRoutes');

const app = express();

// Security middlewares
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const corsOptions = {
   origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']

};

app.use(cors(corsOptions));
app.use(express.json());

// Health check và thông tin hệ thống
app.get('/api/health', async (req, res) => {
  try {
    // Kiểm tra kết nối DB
    const [dbResult] = await db.query('SELECT 1');
    
    const healthData = {
      status: 'UP',
      timestamp: new Date(),
      dbConnection: dbResult ? 'Success' : 'Failed',
      environment: process.env.NODE_ENV || 'development',
      database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME
      },
      server: {
        port: process.env.PORT || 5000
      }
    };
    
    return res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'DOWN',
      timestamp: new Date(),
      dbConnection: 'Failed',
      error: process.env.NODE_ENV === 'production' ? 'Database connection error' : error.message,
      errorCode: error.code,
      errorDetails: process.env.NODE_ENV === 'production' ? null : {
        code: error.code,
        errno: error.errno,
        sql: error.sql,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      }
    });
  }
});

// Kiểm tra kết nối database đơn giản
app.get('/api/db-check', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1 as dbConnection');
    return res.status(200).json({ 
      connected: true, 
      message: 'Database connection successful', 
      data: result 
    });
  } catch (error) {
    console.error('Database connection check failed:', error);
    return res.status(500).json({ 
      connected: false, 
      message: 'Failed to connect to database',
      error: process.env.NODE_ENV === 'production' ? 'Database connection error' : error.message,
      errorCode: error.code
    });
  }
});

// Kiểm tra cấu hình database mà không cần kết nối
app.get('/api/db-config', (req, res) => {
  const dbConfig = {
    host: process.env.DB_HOST || 'Not set',
    database: process.env.DB_NAME || 'Not set',
    user: process.env.DB_USER ? '******' : 'Not set', // Che giấu thông tin nhạy cảm
    password: process.env.DB_PASSWORD ? '******' : 'Not set', // Che giấu thông tin nhạy cảm
    port: process.env.DB_PORT || '3306 (default)',
    environment: process.env.NODE_ENV || 'development',
    server_port: process.env.PORT || 5000
  };
  
  res.status(200).json({
    message: 'Database configuration',
    config: dbConfig,
    envVariables: {
      DB_HOST_set: !!process.env.DB_HOST,
      DB_NAME_set: !!process.env.DB_NAME,
      DB_USER_set: !!process.env.DB_USER,
      DB_PASSWORD_set: !!process.env.DB_PASSWORD,
      DB_PORT_set: !!process.env.DB_PORT
    }
  });
});

app.get('/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.send(ip);
});
// Routes
app.use('/api/vocabulary', vocabRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/history', practiceHistoryRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', conversationalAIRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Chi tiết hóa lỗi dựa trên loại lỗi
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Unauthorized Access';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorMessage = 'Forbidden Access';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = 'Resource Not Found';
  }
  
  // Lưu lỗi để debug và theo dõi
  console.error(`Error ${statusCode}: ${errorMessage}`, {
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    error: err.stack
  });
  
  // Trả về response
  res.status(statusCode).json({ 
    message: process.env.NODE_ENV === 'production' ? errorMessage : err.message,
    path: req.path,
    timestamp: new Date().toISOString(),
    requestId: req.id || Date.now().toString(),
    code: err.code || 'SERVER_ERROR'
  });

});

// Khởi động server cho mọi môi trường
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});

// Export for Vercel

module.exports = app;


