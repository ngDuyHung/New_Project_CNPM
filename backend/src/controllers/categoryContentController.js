const CategoryContent = require('../models/categoryContentModel');

const categoryContentController = {
  // Lấy nội dung của danh mục
  async getCategoryContent(req, res) {
    try {
      const { id } = req.params;
      const content = await CategoryContent.getContent(id);
      res.json(content);
    } catch (error) {
      console.error('Error fetching category content:', error);
      res.status(500).json({ message: 'Error fetching category content', error: error.message });
    }
  },

  // Cập nhật nội dung của danh mục
  async updateCategoryContent(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }
      
      const result = await CategoryContent.updateContent(id, content);
      res.json(result);
    } catch (error) {
      console.error('Error updating category content:', error);
      res.status(500).json({ message: 'Error updating category content', error: error.message });
    }
  },

  // Lấy nội dung của tất cả danh mục
  async getAllCategoryContents(req, res) {
    try {
      const contents = await CategoryContent.getAllContents();
      res.json(contents);
    } catch (error) {
      console.error('Error fetching all category contents:', error);
      res.status(500).json({ message: 'Error fetching all category contents', error: error.message });
    }
  }
};

module.exports = categoryContentController; 