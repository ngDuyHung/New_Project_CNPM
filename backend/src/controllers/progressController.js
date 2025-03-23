const Progress = require('../models/ProgressModel');

const progressController = {
    createProgress: async (req, res) => {
        try {
            const { wordsLearned, exercisesCompleted, badges } = req.body;
            const userId = req.user.id;

            if (wordsLearned == null || exercisesCompleted == null || !badges) {
                return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin!' });
            }

            const progressId = await Progress.createProgress(userId, wordsLearned, exercisesCompleted, badges);
            res.status(201).json({ success: true, data: { progressId }, message: 'Tạo tiến độ thành công!' });
        } catch (error) {
            console.error('Error creating progress:', error);
            res.status(500).json({ success: false, message: 'Không thể kết nối tới Database!' });
        }
    },

    getProgressByUser: async (req, res) => {
        try {
            const userId = req.user.id;
            const progress = await Progress.getProgressByUser(userId);
            if (progress === null) {
                return res.status(404).json({ success: false, message: 'Không tồn tại tiến độ!' });
            }
            res.status(200).json({ success: true, data: progress });
        } catch (error) {
            console.error('Error fetching progress:', error);
            res.status(500).json({ success: false, message: 'Không thể kết nối tới Database!' });
        }
    },

    updateProgress: async (req, res) => {
        try {
            const { progressId } = req.params;
            const { wordsLearned, exercisesCompleted, badges } = req.body;
            const userId = req.user.id;

            const updated = await Progress.updateProgress(progressId, userId, wordsLearned, exercisesCompleted, badges);
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy tiến độ!' });
            }

            res.status(200).json({ success: true, message: 'Cập nhật tiến độ thành công!' });
        } catch (error) {
            console.error('Error updating progress:', error);
            res.status(500).json({ success: false, message: 'Kết nối tới Database thất bại hoặc sai progressId!' });
        }
    },

    deleteProgress: async (req, res) => {
        try {
            const { progressId } = req.params;
            const userId = req.user.id;

            const deleted = await Progress.deleteProgress(progressId, userId);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy tiến độ!' });
            }

            res.status(200).json({ success: true, message: 'Xóa tiến độ thành công!' });
        } catch (error) {
            console.error('Error deleting progress:', error);
            res.status(500).json({ success: false, message: 'Kết nối tới Database thất bại hoặc sai progressId!' });
        }
    }
};

module.exports = progressController; 