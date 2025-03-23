const db = require('../config/db');

class Progress {
    static async createProgress(userId, wordsLearned, exercisesCompleted, badges) {
        const query = 'INSERT INTO progress (user_id, words_learned, exercises_completed, badges) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [userId, wordsLearned, exercisesCompleted, badges]);
        return result.insertId;
    }

    static async getProgressByUser(userId) {
        const query = 'SELECT * FROM progress WHERE user_id = ?';
        const [progress] = await db.query(query, [userId]);
        return progress;
    }

    static async updateProgress(progressId, userId, wordsLearned, exercisesCompleted, badges) {
        const query = 'UPDATE progress SET words_learned = ?, exercises_completed = ?, badges = ? WHERE progress_id = ? AND user_id = ?';
        const [result] = await db.query(query, [wordsLearned, exercisesCompleted, badges, progressId, userId]);
        return result.affectedRows > 0;
    }

    static async deleteProgress(progressId, userId) {
        const query = 'DELETE FROM progress WHERE progress_id = ? AND user_id = ?';
        const [result] = await db.query(query, [progressId, userId]);
        return result.affectedRows > 0;
    }
}


module.exports = Progress; 