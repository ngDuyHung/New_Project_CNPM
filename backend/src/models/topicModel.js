const db = require("../config/db");

class Topic {
    static async create(topic) {
        const result = await db.query(
            "INSERT INTO topics (topic_name) VALUES (?)",
            [topic.title]
        );
        console.log("Insert sucessfully!");
        return result.insertId;
    }

    static async getById(id) {
        const result = await db.query(
            "SELECT * FROM topics WHERE topic_id = ?",
            [id]
        );
        return result[0];
    }

    static async getAll() {
        const result = await db.query(
            "SELECT * FROM topics"
        );
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
        await db.query(
            "DELETE FROM topics WHERE id = ?",
            [id]
        );
    }

}

module.exports = Topic;