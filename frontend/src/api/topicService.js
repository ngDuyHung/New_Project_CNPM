import axiosInstance from './axios';

// Default demo topics
const demoTopics = [
  { topic_id: 'demo1', topic_name: 'Travel Conversation' },
  { topic_id: 'demo2', topic_name: 'Job Interview' },
  { topic_id: 'demo3', topic_name: 'Daily Small Talk' },
  { topic_id: 'demo4', topic_name: 'Ordering Food' },
  { topic_id: 'demo5', topic_name: 'Shopping Conversation' }
];

export const topicService = {
  // Get all topics
  getAllTopics: async () => {
    try {
      const response = await axiosInstance.get('/api/topics/getAllTopics');
      console.log("Topics raw data:", response.data);
      
      // Parse and validate topics
      let topicsData = [];
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        topicsData = response.data;
      } else if (response.data && Array.isArray(response.data[0])) {
        topicsData = response.data[0];
      }
      
      // Validate that topics have the required properties
      const validTopics = topicsData
        .filter(topic => topic && typeof topic === 'object')
        .map(topic => ({
          topic_id: topic.topic_id || topic.id || `fallback_${Math.random().toString(36).substr(2, 9)}`,
          topic_name: topic.topic_name || topic.name || "Unnamed Topic"
        }));
      
      // If no valid topics, return demo topics
      if (validTopics.length === 0) {
        return [...demoTopics];
      }
      
      // Return both real topics and demo topics
      return [...validTopics, ...demoTopics];
    } catch (error) {
      console.error('Error fetching topics:', error);
      // Return demo topics as fallback
      return [...demoTopics];
    }
  },

  // Get topic by ID
  getTopicById: async (id) => {
    // For demo topics, return directly
    if (id && id.startsWith('demo')) {
      const demoTopic = demoTopics.find(t => t.topic_id === id);
      if (demoTopic) return demoTopic;
    }
    
    // For real topics, fetch from API
    try {
      const response = await axiosInstance.get(`/api/topics/${id}`);
      const topic = response.data;
      
      // Validate and normalize the topic
      if (topic && typeof topic === 'object') {
        return {
          topic_id: topic.topic_id || topic.id || id,
          topic_name: topic.topic_name || topic.name || "Unnamed Topic"
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching topic ID ${id}:`, error);
      return null;
    }
  }
};

export default topicService; 