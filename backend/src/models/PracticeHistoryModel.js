const db = require('../config/db');

class PracticeHistory {
    static async createHistory(exerciseId, userId, score, totalQuestions) {
        const query = `
            INSERT INTO practice_history (exercise_id, user_id, score, total_questions)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [exerciseId, userId, score, totalQuestions]);
        return result.insertId;
    }

    static async getHistoryByUser(userId) {
        const query = `
            SELECT 
                ph.id,
                ph.score,
                ph.total_questions,
                ph.datetime,
                t.topic_name,
                e.type,
                e.id as exercise_id,
                t.topic_id
            FROM practice_history ph
            JOIN exercises e ON ph.exercise_id = e.id
            JOIN topics t ON e.topic_id = t.topic_id
            WHERE ph.user_id = ?
            ORDER BY ph.datetime DESC
        `;
        const [history] = await db.query(query, [userId]);
        return history;
    }
    static async getHistoryById(id) {
        const query = `SELECT * FROM practice_history WHERE id = ?`;
        const [history] = await db.query(query, [id]); // Lấy kết quả chính xác
        return history; 
    }
    // Cập nhật lịch sử làm bài
    static async updateHistory(id, score, totalQuestions, exercise_id) {
        const query = `
            UPDATE practice_history 
            SET score = ?, total_questions = ?, exercise_id = ?
            WHERE id = ?
        `;
        await db.query(query, [score, totalQuestions, exercise_id, id]);
        return { success: true };
    }
    static async deleteHistory(id) {
        const query = `DELETE FROM practice_history WHERE id = ?`;
        await db.query(query, [id]);
        return { success: true };
    }
}

module.exports = PracticeHistory; 