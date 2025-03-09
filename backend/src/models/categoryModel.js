const db = require('../config/db');

class Category {
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM categories');
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category; 