require('dotenv').config({ path: '../.env' });
const fs = require('fs').promises;
const path = require('path');
const db = require('../config/db');

async function addConversationalAICategory() {
  try {
    console.log('Starting to add Conversational AI category...');
    
    // Check if category already exists
    const [existingCategories] = await db.query('SELECT * FROM categories WHERE name = ?', ['Conversational AI']);
    
    let categoryId;
    
    if (existingCategories.length > 0) {
      categoryId = existingCategories[0].id;
      console.log(`Category "Conversational AI" already exists with ID ${categoryId}`);
    } else {
      // Insert the new category
      const [result] = await db.query(
        'INSERT INTO categories (name, description, icon, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        ['Conversational AI', 'Practice English conversation with AI assistant', 'chat']
      );
      
      categoryId = result.insertId;
      console.log(`Created new category "Conversational AI" with ID ${categoryId}`);
    }
    
    // Create content directory if it doesn't exist
    const contentDir = path.join(__dirname, '../../content');
    try {
      await fs.mkdir(contentDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    // Define content file path
    const contentFilePath = path.join(contentDir, `category_${categoryId}.txt`);
    
    // Check if content file exists
    try {
      await fs.access(contentFilePath);
      console.log(`Content file already exists at ${contentFilePath}`);
    } catch (error) {
      // If file doesn't exist, copy the prepared content
      const sourceContentPath = path.join(__dirname, '../../content/conversational_ai_content.txt');
      
      try {
        // Check if source content file exists
        await fs.access(sourceContentPath);
        
        // Copy content
        const content = await fs.readFile(sourceContentPath, 'utf8');
        await fs.writeFile(contentFilePath, content, 'utf8');
        console.log(`Created content file at ${contentFilePath}`);
      } catch (err) {
        // If source doesn't exist, create a default content
        const defaultContent = `# Conversational AI\n\nPractice your English speaking and listening skills by chatting with our AI assistant. Select topics and personas to customize your learning experience.`;
        await fs.writeFile(contentFilePath, defaultContent, 'utf8');
        console.log(`Created default content file at ${contentFilePath}`);
      }
    }
    
    console.log('Conversational AI category setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up Conversational AI category:', error);
  } finally {
    // Close database connection
    await db.end();
  }
}

// Run the function
addConversationalAICategory(); 