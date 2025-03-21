const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");

const auth = require('../middleware/auth');

// CRUD Topics
router.post("/create", topicController.createTopic); // Yêu cầu xác thực
router.get("/", topicController.getAllTopics); // Public API (không yêu cầu đăng nhập)
router.get("/:id", topicController.getTopicById); // Public API
router.put("/:id", auth, topicController.updateTopic); // Yêu cầu xác thực
// router.delete("/:id", auth, topicController.deleteTopic); // Yêu cầu xác thực

module.exports = router;
