const ConversationalAI = require('../models/conversationalAIModel');

const conversationalAIController = {
  async chatWithAI(req, res) {
    try {
      const { message, topic, persona } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required',
        });
      }

      const response = await ConversationalAI.generateResponse(message, topic, persona);

      res.json(response);
    } catch (error) {
      console.error('Error in AI chat controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  },

  async generateFillInTheBlank(req, res) {
    try {
      const { word, meaning } = req.body;

      if (!word || !meaning) {
        return res.status(400).json({
          success: false,
          message: 'Word and meaning are required',
        });
      }

      const result = await ConversationalAI.generateFillInTheBlankWithGemi(word, meaning);

      if (result) {
        res.status(200).json({
          success: true,
          data: result,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to generate fill-in-the-blank exercise',
        });
      }
    } catch (error) {
      console.error('Error in generateFillInTheBlank controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  },
};

module.exports = conversationalAIController;