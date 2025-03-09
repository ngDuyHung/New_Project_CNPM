const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const categoryContentController = require('../controllers/categoryContentController');
const auth = require('../middleware/auth');

// Route cho danh mục
router.get('/categories', categoryController.getCategories);

// Route cho nội dung danh mục
router.get('/categories/:id/content', categoryContentController.getCategoryContent);
router.put('/categories/:id/content', auth, categoryContentController.updateCategoryContent);
router.get('/categories/contents', categoryContentController.getAllCategoryContents);

module.exports = router; 