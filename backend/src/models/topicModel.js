const db = require("../config/db");
const User = require("./userModel");

class Topic {
    static async create(topic) {
        const [result] = await db.query(
            "INSERT INTO topics (topic_name,user_id) VALUES (?,?)",
            [topic.title, topic.user_id]
        );
        
        console.log("Insert sucessfully!");
        return result.affectedRows > 0 ? result.insertId : null;
    }

    static async getById(id) {
        const [result] = await db.query(
            "SELECT * FROM topics WHERE topic_id = ?",
            [id]
        );
        return result?.length > 0 ? result : null;
    }
    static async getByName(name) {
        const result = await db.query(
            "SELECT topic_id FROM topics WHERE topic_name = ?",
            [name]
        );

        return result?.length > 0 ? result : null;
    }

    static async getAll() {
        const result = await db.query("SELECT * FROM topics");
        return result;
    }

    static async update(id, topic) {
        try {
            await db.query(
                "UPDATE topics SET topic_name = ? WHERE topic_id = ?",
                [topic, id]
            );
            console.log("Update successfully!");
        } catch (error) {
            console.error("Loi SQL: ", error);
        }
    }

    static async delete(id) {
        await db.query("DELETE FROM vocabulary WHERE topic_id = 1;");
        await db.query("DELETE FROM topics WHERE topic_id = ?", [id]);
    }

    static async findByPk(id) {
        return db.query("SELECT * FROM topics WHERE topic_id = ?", [id]);
    }

    static async getAllByUserId(userId) {
        const [result] = await db.query(
            "SELECT * FROM topics WHERE user_id = ?",
            [userId]
        );
        return result;
    }
}

module.exports = Topic;
