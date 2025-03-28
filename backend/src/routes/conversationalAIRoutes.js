const express = require('express');
const router = express.Router();
const conversationalAIController = require('../controllers/conversationalAIController');
const auth = require('../middleware/auth');

// Route for conversational AI chat
router.post('/conversational-ai/chat', auth, conversationalAIController.chatWithAI);

module.exports = router; 