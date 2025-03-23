const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgesController');
const auth = require('../middleware/auth');

router.post('/', auth, badgeController.createBadge);
router.get('/', auth, badgeController.getBadgesByUser);
router.delete('/:badgeId', auth, badgeController.deleteBadge);
router.put('/:badgeId', auth, badgeController.updateBadge);

module.exports = router; 