const { GoogleGenAI } = require('@google/genai'); // Đảm bảo import đúng thư viện
const TopicModel = require('./topicModel');
const db = require('../config/db');

// Initialize the API client with API key
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'YOUR_API_KEY', // Đảm bảo API key hợp lệ
});

class ConversationalAI {
  static async generateResponse(message, topicId, persona) {
    try {
      // Get topic content if a topic is specified
      let topicContext = '';
      if (topicId) {
        // Get topic by ID and include vocabulary words
        try {
          const [topics] = await db.query(
            `SELECT t.topic_id, t.topic_name, GROUP_CONCAT(v.word SEPARATOR ', ') as words
             FROM topics t
             LEFT JOIN vocabulary v ON t.topic_id = v.topic_id
             WHERE t.topic_id = ?
             GROUP BY t.topic_id, t.topic_name`,
            [topicId]
          );
          
          if (topics && topics.length > 0) {
            const topic = topics[0];
            topicContext = `
              The current topic of conversation is "${topic.topic_name}". 
              Here are some relevant vocabulary words for this topic: ${topic.words || "No specific vocabulary provided"}.
            `;
          }
        } catch (error) {
          console.error('Error fetching topic:', error);
        }
      }

      // Define persona characteristics based on the selected role
      const personaContext = this.getPersonaContext(persona);

      // Construct the system prompt with all the context
      const systemPrompt = `
        You are an AI-powered English language tutor${persona ? ` acting as a ${persona.replace('_', ' ')}` : ''}.
        ${personaContext}
        
        Your goal is to help the user practice conversational English in a natural way.
        
        ${topicContext}
        
        Follow these guidelines in your responses:
        
        1. Respond conversationally and naturally, as in a real dialog.
        2. Keep responses concise (1-4 sentences) unless explaining something complex.
        3. If the user makes grammar mistakes, subtly correct them in your response without explicitly pointing them out.
        4. Occasionally introduce new vocabulary words that are relevant to the conversation.
        5. For important or difficult vocabulary, include a brief definition in parentheses.
        6. Adjust your language complexity to match the user's level.
        7. Ask follow-up questions to keep the conversation going.
        
        Remember: This is a practice conversation to help improve English speaking skills.
      `;

      // Generate response using Gemini API
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const result = await model.generateContent({
        contents: [
          { role: 'system', parts: [{ text: systemPrompt }] },
          { role: 'user', parts: [{ text: message }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      });

      const response = result.response;
      return {
        message: response.text(),
        success: true
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        message: "I'm sorry, I'm having trouble processing your request right now. Could you try again?",
        success: false,
        error: error.message
      };
    }
  }

  static async generateFillInTheBlankWithGemi(word, meaning) {
    try {
      const prompt = `Create a fill-in-the-blank exercise for the word "${word}" with the meaning "${meaning}".
      The response should be formatted as a JSON object with the following keys:
      - "sentence": A sentence with a blank where the word fits.
      - "correctAnswer": The correct word that fits the blank.
      - "options": A list of 4 options, including 4 incorrect answers.
      Ensure the response is a valid JSON object without any additional formatting or Markdown.`;
      const result = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      
      const text = result.text; // Truy cập phản hồi từ API
      console.log('Raw response from Gemini API:', text);
      if (text) {
        try {
          // Loại bỏ các ký tự không mong muốn
          const cleanedText = text.replace(/```json|```/g, '').trim();
      
          const data = JSON.parse(cleanedText);
      
          // Validate the response format
          if (
            data &&
            typeof data.sentence === 'string' &&
            typeof data.correctAnswer === 'string' &&
            Array.isArray(data.options) &&
            data.options.length === 4 &&
            data.options.every(option => typeof option === 'string')
          ) {
            return {
              sentence: data.sentence,
              correctAnswer: data.correctAnswer,
              options: data.options,
            };
          } else {
            console.error('Invalid response format from Gemini API:', data);
            return null;
          }
        } catch (error) {
          console.error('Error parsing JSON response from Gemini:', error, text);
          return null;
        }
      } else {
        console.warn('No text content in the response from Gemini.');
        return null;
      }
    } catch (error) {
      console.error('Error generating fill-in-the-blank with Gemini:', error);
      return null;
    }
  }

  static getPersonaContext(persona) {
    const personas = {
      'teacher': `
        You are a professional English language teacher with a friendly and encouraging approach.
        Use academic language occasionally and provide constructive correction.
        Be supportive and pedagogical in your approach.
      `,
      'tourist_guide': `
        You are a knowledgeable local tour guide helping a tourist practice English.
        Use travel-related vocabulary and speak about local attractions, customs, and tips.
        Be friendly, enthusiastic, and use expressions common in tourism contexts.
      `,
      'interviewer': `
        You are a job interviewer asking professional questions.
        Use business language and formal expressions appropriate for a job interview.
        Ask questions about qualifications, experiences, and scenarios to help the user practice job interview English.
      `,
      'friend': `
        You are a casual friend having an everyday conversation.
        Use informal, conversational English with common slang and expressions.
        Be relaxed, supportive, and talk about everyday topics.
      `,
      'business': `
        You are a business partner or colleague discussing work-related matters.
        Use professional business vocabulary and formal expressions.
        Focus on work projects, meetings, and professional development topics.
      `
    };

    return personas[persona] || personas['teacher'];
  }

  static async listAvailableModels() {
    try {
      const models = await genAI.models.listModels();
      console.log('Available models:', models);
    } catch (error) {
      console.error('Error listing models:', error);
    }
  }

}


module.exports = ConversationalAI;