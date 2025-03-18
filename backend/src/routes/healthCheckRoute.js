// routes/healthCheckRoute.js
import express from 'express';
import { pool } from '../config/db.js'; // Import pool kết nối từ file cấu hình

const router = express.Router();

router.get('/check-db', async (req, res) => {
  let connection;
  try {
    // Thực hiện kết nối và truy vấn
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS userCount FROM users'
    );
    
    return res.status(200).json({
      success: true,
      userCount: rows[0].userCount,
      message: 'Kết nối database thành công'
    });

  } catch (error) {
    // Phân loại lỗi chi tiết
    let statusCode = 500;
    let errorMessage = 'Lỗi server nội bộ';

    // Xử lý các loại lỗi cụ thể
    switch (error.code) {
      case 'ECONNREFUSED':
      case 'ETIMEDOUT':
        statusCode = 503;
        errorMessage = 'Không thể kết nối đến database server';
        break;
        
      case 'ER_ACCESS_DENIED_ERROR':
        statusCode = 403;
        errorMessage = 'Sai thông tin xác thực database';
        break;
        
      case 'ER_NO_SUCH_TABLE':
        statusCode = 404;
        errorMessage = 'Bảng users không tồn tại';
        break;
        
      default:
        // Ghi log lỗi không xác định
        console.error('Database error:', {
          code: error.code,
          errno: error.errno,
          sqlState: error.sqlState,
          sqlMessage: error.sqlMessage
        });
        break;
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: {
        code: error.code,
        details: error.sqlMessage || error.message
      }
    });
    
  } finally {
    if (connection) await connection.release(); // Giải phóng kết nối
  }
});

export default router;
