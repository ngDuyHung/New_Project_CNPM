const db = require("../config/db");

class VocabularyModel {
    static async create(vocab) {
        try {
            const { topic_id, word, meaning, pronunciation, image_path, sound_path } = vocab;
            const result = await db.query(
                "INSERT INTO vocabulary (topic_id, word, meaning, pronunciation, image_path, sound_path) VALUES (?,?,?,?,?,?)",
                [topic_id, word, meaning, pronunciation, image_path, sound_path]
            );
            console.log("Insert sucessfully!");
            return result.insertId;
        } catch (error) {
            console.error("Error inserting vocabulary:", error);
            throw error;
        }
        }

     static async getAll() {
            const result = await db.query(
                "SELECT * FROM vocabulary"
            );
            return result;
        }

    static async update(word, meaning, pronunciation, image_path, sound_path, id) {
        try {
            console.log(word, meaning, pronunciation, image_path, sound_path, id);
            const sql = `
                UPDATE vocabulary
                SET word = ?, meaning = ?, pronunciation = ?, image_path = ?, sound_path = ? 
                WHERE word_id = ?
            `;
            const [result] = await db.query(sql, [
                word,
                meaning,
                pronunciation,
                image_path,
                sound_path,
                id
            ]);
            return result; // Trả về kết quả query
        } catch (error) {
            throw error; // Ném lỗi để controller xử lý
        }    
    }
    static async delete(id) {
            console.log(id);
            await db.query(
                "DELETE FROM vocabulary WHERE word_id = ?",
                [id]
            );
            console.log("Delete successfully!");
        }
    static async getById(id) {
        const [rows] = await db.query(
            "SELECT * FROM vocabulary WHERE word_id = ?",
            [id]
        );
            return rows.length > 0 ? rows[0] : null;
        }
    static async findByPk(id) {
            return db.query(
                "SELECT * FROM vocabulary WHERE word_id = ?",
                [id]
            );
        }
    static async getVocabByTopicId(topicId) {
        const [rows] = await db.query(
            "SELECT * FROM vocabulary WHERE topic_id = ?",
            [topicId]
        );
        return rows;
    }
}
module.exports = VocabularyModel;