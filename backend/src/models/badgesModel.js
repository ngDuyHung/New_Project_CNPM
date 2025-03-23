const db = require('../config/db');

class Badge {
    static async createBadge(userId, badgeName) {
        const query = 'INSERT INTO badges (user_id, badge_name) VALUES (?, ?)';
        const [result] = await db.query(query, [userId, badgeName]);
        return result.insertId;
    }

    static async getBadgesByUser(userId) {
        const query = 'SELECT * FROM badges WHERE user_id = ?';
        const [badges] = await db.query(query, [userId]);
        return badges;
    }

    static async deleteBadge(badgeId, userId) {
        const query = 'DELETE FROM badges WHERE badge_id = ? AND user_id = ?';
        const [result] = await db.query(query, [badgeId, userId]);
        return result.affectedRows > 0;
    }
    static async updateBadge(badgeId, userId, badgeName) {
        const query = 'UPDATE badges SET badge_name = ? WHERE badge_id = ? AND user_id = ?';
        const [result] = await db.query(query, [badgeName, badgeId, userId]);
        return result.affectedRows > 0;
    }
}


module.exports = Badge; 