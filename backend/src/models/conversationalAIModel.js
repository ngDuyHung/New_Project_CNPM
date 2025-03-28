const { GoogleGenerativeAI } = require('@google/generative-ai');
const TopicModel = require('./topicModel');
const db = require('../config/db');

// Initialize the API client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY');

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
}

module.exports = ConversationalAI; 