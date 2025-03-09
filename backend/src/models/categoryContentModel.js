const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

// Đường dẫn đến thư mục chứa file nội dung danh mục
const CONTENT_DIR = path.join(__dirname, '../../content');

class CategoryContent {
  // Lấy nội dung của danh mục từ file text
  static async getContent(categoryId) {
    try {
      // Đảm bảo thư mục content tồn tại
      try {
        await fs.mkdir(CONTENT_DIR, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }

      // Lấy thông tin danh mục từ database
      const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
      
      if (categories.length === 0) {
        throw new Error('Category not found');
      }
      
      const category = categories[0];
      const filePath = path.join(CONTENT_DIR, `category_${categoryId}.txt`);
      
      // Kiểm tra xem file có tồn tại không
      try {
        const content = await fs.readFile(filePath, 'utf8');
        return {
          category,
          content
        };
      } catch (error) {
        if (error.code === 'ENOENT') {
          // File không tồn tại, tạo file mới với nội dung mặc định
          const defaultContent = `Nội dung mặc định cho danh mục ${category.name}`;
          await fs.writeFile(filePath, defaultContent, 'utf8');
          return {
            category,
            content: defaultContent
          };
        }
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  // Lưu nội dung mới cho danh mục
  static async updateContent(categoryId, content) {
    try {
      // Kiểm tra danh mục có tồn tại không
      const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
      
      if (categories.length === 0) {
        throw new Error('Category not found');
      }

      // Đảm bảo thư mục content tồn tại
      try {
        await fs.mkdir(CONTENT_DIR, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }
      
      // Lưu nội dung vào file
      const filePath = path.join(CONTENT_DIR, `category_${categoryId}.txt`);
      await fs.writeFile(filePath, content, 'utf8');
      
      return {
        success: true,
        message: 'Content updated successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy nội dung của tất cả danh mục
  static async getAllContents() {
    try {
      // Lấy tất cả danh mục từ database
      const [categories] = await db.query('SELECT * FROM categories');
      
      const results = await Promise.all(categories.map(async category => {
        try {
          const filePath = path.join(CONTENT_DIR, `category_${category.id}.txt`);
          const content = await fs.readFile(filePath, 'utf8');
          return {
            ...category,
            content
          };
        } catch (error) {
          if (error.code === 'ENOENT') {
            return {
              ...category,
              content: `Nội dung mặc định cho danh mục ${category.name}`
            };
          }
          throw error;
        }
      }));
      
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryContent; 