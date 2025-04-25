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

  async generateVocabulary(req, res) {
    try {
      const { topic, count } = req.body;
  
      // Kiểm tra dữ liệu đầu vào
      if (!topic || !count) {
        return res.status(400).json({
          success: false,
          message: 'Topic and count are required',
        });
      }
  
      // Gọi API Gemi để tạo từ vựng
      const result = await ConversationalAI.generateVocabularyWithGemi(topic, count);
  
      // Kiểm tra kết quả trả về từ API Gemi
      if (result && Array.isArray(result)) {
        res.status(200).json({
          success: true,
          data: result, // Trả về danh sách từ vựng
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to generate vocabulary',
        });
      }
    } catch (error) {
      console.error('Error in generateVocabulary controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

};

module.exports = conversationalAIController;