const express = require('express');
const router = express.Router();
const conversationalAIController = require('../controllers/conversationalAIController');
const auth = require('../middleware/auth');

// Route for conversational AI chat
router.post('/conversational-ai/chat', auth, conversationalAIController.chatWithAI);

// Route for generating fill-in-the-blank exercises
router.post('/conversational-ai/generate-fill-in-the-blank', auth, conversationalAIController.generateFillInTheBlank);

//// Route for generating vocabulary exercises
router.post('/conversational-ai/generate-vocabulary', auth, conversationalAIController.generateVocabulary);
module.exports = router; 