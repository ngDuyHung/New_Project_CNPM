require('dotenv').config({ path: '../.env' });
const db = require('../config/db');

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Create categories table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Categories table created or already exists');
    
    // Insert Conversational AI category if it doesn't exist
    const [existingConversationalAI] = await db.query('SELECT * FROM categories WHERE name = ?', ['Conversational AI']);
    
    if (existingConversationalAI.length === 0) {
      await db.query(
        'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)',
        ['Conversational AI', 'Practice English conversation with AI assistant', 'chat']
      );
      console.log('Added Conversational AI category');
    } else {
      console.log('Conversational AI category already exists');
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await db.end();
  }
}

// Run the function
setupDatabase(); 