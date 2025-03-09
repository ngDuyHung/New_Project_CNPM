const Category = require('../models/categoryModel');

const categoryController = {
  async getCategories(req, res) {
    try {
      const categories = await Category.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  }
};

module.exports = categoryController; 