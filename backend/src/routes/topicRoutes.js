const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");

const auth = require("../middleware/auth");

// CRUD Topics
router.get("/getAllTopicsByUserId", topicController.getAllTopicsByUserId);
router.post("/create", topicController.createTopic);
router.get("/getAllTopics", topicController.getAllTopics); // Public API (không yêu cầu đăng nhập)
router.delete("/delete", auth, topicController.deleteTopic); // Yêu cầu xác thực
router.get("/:id", topicController.getTopicById); // Public API
router.get("/:name", topicController.getTopicByName); // Public API
router.put("/:id", auth, topicController.updateTopic); // Yêu cầu xác thực

module.exports = router;
