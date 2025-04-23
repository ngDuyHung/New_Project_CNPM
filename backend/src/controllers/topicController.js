const Topic = require("../models/topicModel");
const { use } = require("../routes/topicRoutes");

const topicController = {
    //[POST] Create a new topic
    createTopic: async (req, res) => {
        try {
            console.log(req.body); // Kiểm tra dữ liệu đầu vào
            const topicId = await Topic.create(req.body); // Gọi trực tiếp model
            res.status(201).json({
                id: topicId,
                message: "Topic created successfully",
            });
        } catch (error) {
            console.error("Error in createTopic:", error.message);
            res.status(400).send(error);
        }
    },

    //[GET] Get all topics
    getAllTopics: async (req, res) => {
        try {
            const [topics] = await Topic.getAll({});
            res.status(200).send(topics);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    //[GET] Get a single topic by ID
    getTopicById: async (req, res) => {
        try {
            const topic = await Topic.getById(req.params.id);
            if (!topic) {
                return res.status(404).send();
            }
            res.status(200).send(topic);
        } catch (error) {
            res.status(500).send(error);
        }
    },
     //[GET] Get a single topic by name
     getTopicByName: async (req, res) => {
        try {
            const topic = await Topic.getByName(req.params.name);
            console.log(topic);
            if (!topic) {
                return res.status(404).send();
            }
            res.status(200).send(topic);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    
    // [PUT]Update a topic by ID
    updateTopic: async (req, res) => {
        try {
            const topicId = req.params.id; // Lấy ID trước
            const topicData = req.body.title; // Dữ liệu cập nhật

            const topic = await Topic.update(topicId, topicData);

            // Lấy lại dữ liệu sau khi cập nhật
            const updatedTopic = await Topic.findByPk(topicId);

            res.status(200).json(updatedTopic);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete a topic by ID
    deleteTopic: async (req, res) => {
        try {
            const topic = await Topic.getById(req.body.id); // Lấy dữ liệu trước
            if (!topic) {
                return res.status(404).json({ message: "Topic not found" });
            }

            await Topic.delete(req.body.id);
            return res.status(204).send();
        } catch (error) {
            res.status(500).send(error);
        }
    },

    // Get all topics by user ID
    getAllTopicsByUserId: async (req, res) => {
        try {
            const userId = req.query.user_id; // Lấy user_id từ body
            console.log(userId); // Kiểm tra user_id
            const topics = await Topic.getAllByUserId(userId); // Gọi model để lấy danh sách topic theo user_id
            res.status(200).send(topics);
        } catch (error) {
            res.status(500).send(error);
        }
    },
};

module.exports = topicController;
