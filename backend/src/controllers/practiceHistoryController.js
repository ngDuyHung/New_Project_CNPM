const PracticeHistory = require('../models/PracticeHistoryModel');
const practiceHistory = {
    saveResult: async (req, res) => {
        try {
            const { 
                exerciseId, 
                correctAnswers, 
                totalQuestions,
                type,
                topicId,
                topicName 
            } = req.body;
            const userId = req.user.id;

            // Validate dữ liệu
            if (!exerciseId || correctAnswers === undefined || !totalQuestions || !type || !topicId || !topicName) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin cần thiết'
                });
            }

            // Validate type
            const validTypes = ['dienkhuyet', 'nghenoi', 'viet'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Loại bài tập không hợp lệ'
                });
            }

            // Lưu vào history
            await PracticeHistory.createHistory(
                exerciseId,
                userId,
                correctAnswers,
                totalQuestions
            );

            res.status(200).json({
                success: true,
                message: 'Lưu kết quả thành công',
                data: {
                    exerciseId,
                    topicId,
                    topicName,
                    type,
                    score: `${correctAnswers}/${totalQuestions}`
                }
            });

        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    getHistory: async (req, res) => {
        try {
            const userId = req.user.id;
            const history = await PracticeHistory.getHistoryByUser(userId);
            
            // Format lại dữ liệu
            const formattedHistory = history.map(item => ({
                id: item.id,
                exerciseId: item.exercise_id,
                topicId: item.topic_id,
                topicName: item.topic_name,
                type: item.type,
                score: `${item.score}/${item.total_questions}`,
                datetime: item.datetime
            }));

            res.status(200).json({
                success: true,
                data: formattedHistory
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy lịch sử'
            });
        }
    },
    updateHistory: async (req, res) => {
        try {
            const { id, score, totalQuestions, exercise_id } = req.body; 
            // Kiểm tra nếu history tồn tại
            const history = await PracticeHistory.getHistoryById(id);
            if (!history) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy lịch sử!",
                });
            }
            // Cập nhật dữ liệu
            await PracticeHistory.updateHistory(id, score, totalQuestions, exercise_id) ;
            res.json({
                success: true,
                message: "Cập nhật lịch sử thành công!",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message,
            });
        }
    },
    deleteHistory: async (req, res) => {
        try {
            const { id } = req.params;
    
            // Kiểm tra xem lịch sử làm bài có tồn tại không
            const history = await PracticeHistory.getHistoryById(id);
            if (!history) {
                return res.status(404).json({ success: false, message: "Không tìm thấy lịch sử làm bài" });
            }
    
            // Thực hiện xóa
            await PracticeHistory.deleteHistory(id);
    
            res.json({ success: true, message: "Xóa thành công!" });
        } catch (error) {
            console.error("Lỗi xóa:", error);
            res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = practiceHistory; 