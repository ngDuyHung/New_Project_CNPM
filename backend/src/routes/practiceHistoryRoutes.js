const express = require('express');
const router = express.Router();
const practiceHistory = require('../controllers/practiceHistoryController');
const auth = require('../middleware/auth');

// Lưu kết quả bài tập
router.post('/result', auth, practiceHistory.saveResult);

// Lấy lịch sử làm bài 
router.get('/', auth, practiceHistory.getHistory);
router.put('/update', auth, practiceHistory.updateHistory);
router.delete('/delete/:id', auth, practiceHistory.deleteHistory);
module.exports = router; 