const db = require('../config/db');

class Exercise {
    static async createExercise(topicId, type, userId) {
        const query = 'INSERT INTO exercises (topic_id, type, user_id) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [topicId, type, userId]);
        return result.insertId;
    }

    static async createFlashcard(exerciseId, imageUrl, engWord, vieWord) {
        const query = 'INSERT INTO flashcard (exercise_id, image_url, eng_word, vie_word) VALUES (?, ?, ?, ?)';
        await db.query(query, [exerciseId, imageUrl, engWord, vieWord]);
    }

    static async createDienKhuyet(exerciseId, sentence, correctAnswer, answer1, answer2, answer3) {
        const query = 'INSERT INTO dienkhuyet (exercise_id, sentence, correct_answer, answer1, answer2, answer3) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [exerciseId, sentence, correctAnswer, answer1, answer2, answer3]);
    }

    static async createNgheNoi(exerciseId, questionText) {
        const query = 'INSERT INTO nghenoi (exercise_id, question_text) VALUES (?, ?)';
        await db.query(query, [exerciseId, questionText]);
    }

    static async createViet(exerciseId, engWord, vieWord) {
        const query = 'INSERT INTO viet (exercise_id, eng_word, vie_word) VALUES (?, ?, ?)';
        await db.query(query, [exerciseId, engWord, vieWord]);
    }

    static async getExercisesByTopic(topicId, type, userId) {
        const query = 'SELECT * FROM exercises WHERE topic_id = ? AND type = ? AND user_id = ?';
        const [exercises] = await db.query(query, [topicId, type, userId]);
        return exercises;
    }

    static async getFlashcardsByExercise(exerciseId, userId) {
        const query = `
            SELECT f.* 
            FROM flashcard f
            JOIN exercises e ON e.id = f.exercise_id 
            WHERE f.exercise_id = ? AND e.user_id = ?
        `;
        const [flashcards] = await db.query(query, [exerciseId, userId]);
        return flashcards;
    }

    static async getDienKhuyetByExercise(exerciseId, userId) {
        const query = `
            SELECT d.* 
            FROM dienkhuyet d 
            JOIN exercises e ON e.id = d.exercise_id 
            WHERE e.id = ? AND e.user_id = ?
        `;
        const [details] = await db.query(query, [exerciseId, userId]);
        return details;
    }

    static async getNgheNoiByExercise(exerciseId, userId) {
        const query = `
            SELECT n.* 
            FROM nghenoi n
            JOIN exercises e ON e.id = n.exercise_id 
            WHERE n.exercise_id = ? AND e.user_id = ?
        `;
        const [ngheNoi] = await db.query(query, [exerciseId, userId]);
        return ngheNoi;
    }

    static async getVietByExercise(exerciseId, userId) {
        const query = `
            SELECT v.* 
            FROM viet v
            JOIN exercises e ON e.id = v.exercise_id 
            WHERE v.exercise_id = ? AND e.user_id = ?
        `;
        const [viet] = await db.query(query, [exerciseId, userId]);
        return viet;
    }

    // Cập nhật bài tập
    static async updateExercise(exerciseId, type, content, userId) {
        // Kiểm tra quyền sở hữu trước khi update
        const query = 'UPDATE exercises SET type = ? WHERE id = ? AND user_id = ?';
        const [result] = await db.query(query, [type, exerciseId, userId]);
        return result.affectedRows > 0;
    }

    // Xóa bài tập
    static async deleteExercise(exerciseId, userId) {
        // Kiểm tra quyền sở hữu trước khi xóa
        const query = 'DELETE FROM exercises WHERE id = ? AND user_id = ?';
        const [result] = await db.query(query, [exerciseId, userId]);
        return result.affectedRows > 0;
    }

    // Update methods for specific exercise types
    static async updateFlashcard(id, imageUrl, engWord, vieWord, userId) {
        const query = `
            UPDATE flashcard f
            JOIN exercises e ON e.id = f.exercise_id
            SET f.image_url = ?, f.eng_word = ?, f.vie_word = ?
            WHERE f.id = ? AND e.user_id = ?
        `;
        await db.query(query, [imageUrl, engWord, vieWord, id, userId]);
    }
 

    static async updateDienKhuyet(id, sentence, correctAnswer, answer1, answer2, answer3) {
        const query = 'UPDATE dienkhuyet SET sentence = ?, correct_answer = ?, answer1 = ?, answer2 = ?, answer3 = ? WHERE id = ?';
        await db.query(query, [sentence, correctAnswer, answer1, answer2, answer3, id]);
    }

    static async updateNgheNoi(id, questionText, userId) {
        const query = `
            UPDATE nghenoi n
            JOIN exercises e ON e.id = n.exercise_id
            SET n.question_text = ?
            WHERE n.id = ? AND e.user_id = ?
        `;
        await db.query(query, [questionText, id, userId]);
    }

    static async updateViet(id, engWord, vieWord, userId) {
        const query = `
            UPDATE viet v
            JOIN exercises e ON e.id = v.exercise_id
            SET v.eng_word = ?, v.vie_word = ?
            WHERE v.id = ? AND e.user_id = ?
        `;
        await db.query(query, [engWord, vieWord, id, userId]);
    }

    // Delete methods for specific exercise types
    static async deleteFlashcard(id, userId) {
        const query = `
            DELETE f FROM flashcard f
            JOIN exercises e ON e.id = f.exercise_id
            WHERE f.id = ? AND e.user_id = ?
        `;
        await db.query(query, [id, userId]);
    }

    static async deleteDienKhuyet(id) {
        const query = 'DELETE FROM dienkhuyet WHERE id = ?';
        await db.query(query, [id]);
    }

    static async deleteNgheNoi(id, userId) {
        const query = `
            DELETE n FROM nghenoi n
            JOIN exercises e ON e.id = n.exercise_id
            WHERE n.id = ? AND e.user_id = ?
        `;
        await db.query(query, [id, userId]);
    }

    static async deleteViet(id, userId) {
        const query = `
            DELETE v FROM viet v
            JOIN exercises e ON e.id = v.exercise_id
            WHERE v.id = ? AND e.user_id = ?
        `;
        await db.query(query, [id, userId]);
    }
}

module.exports = Exercise; 