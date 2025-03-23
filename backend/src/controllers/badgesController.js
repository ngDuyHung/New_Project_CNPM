const Badge = require('../models/badgesModel');

const badgeController = {
    createBadge: async (req, res) => {
        try {
            const { badgeName } = req.body;
            const userId = req.user.id;

            if (!badgeName) {
                return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin!' });
            }

            const badgeId = await Badge.createBadge(userId, badgeName);
            res.status(201).json({ success: true, data: { badgeId }, message: 'Tạo danh hiệu thành công!' });
        } catch (error) {
            console.error('Error creating badge:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    getBadgesByUser: async (req, res) => {
        try {
            const userId = req.user.id;
            const badges = await Badge.getBadgesByUser(userId);
            if (badges === null) {
                return res.status(404).json({ success: false, message: 'Không tồn tại danh hiệu!' });
            }
            res.status(200).json({ success: true, data: badges });
        } catch (error) {
            console.error('Error fetching badges:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    deleteBadge: async (req, res) => {
        try {
            const { badgeId } = req.params;
            const userId = req.user.id;

            const deleted = await Badge.deleteBadge(badgeId, userId);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy danh hiệu!' });
            }

            res.status(200).json({ success: true, message: 'Xóa danh hiệu thành công!' });
        } catch (error) {
            console.error('Error deleting badge:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    updateBadge: async (req, res) => {
        try {
            const { badgeId } = req.params;
            const { badgeName } = req.body;
            const userId = req.user.id;

            if (!badgeName) {
                return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin!' });
            }

            const updated = await Badge.updateBadge(badgeId, userId, badgeName);
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy danh hiệu!' });
            }

            res.status(200).json({ success: true, message: 'Cập nhật danh hiệu thành công!' });
        } catch (error) {
            console.error('Error updating badge:', error);
            res.status(500).json({ success: false, message: 'Cập nhật danh hiệu thất bại!' });
        }
    }
};

module.exports = badgeController; 