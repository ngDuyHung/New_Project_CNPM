const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.post('/', auth, progressController.createProgress);
router.get('/', auth, progressController.getProgressByUser);
router.put('/:progressId', auth, progressController.updateProgress);
router.delete('/:progressId', auth, progressController.deleteProgress);

module.exports = router; 