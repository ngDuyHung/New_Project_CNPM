const db = require('../config/db');

const User = {
  async findByEmail(email) {
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users;
  },

  async findByUsername(username) {
    const [users] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return users;
  },

  async create(userData) {
    const { username, email, password } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    return result;
  },

  async findById(id) {
    const [users] = await db.execute(
      'SELECT id, username, email FROM users WHERE id = ?',
      [id]
    );
    return users[0];
  }
};

module.exports = User; 