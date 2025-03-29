const express = require("express");
const router = express.Router();
const vocabularyController = require("../controllers/vocabularyController");

// CRUD vocabulary
router.post("/create", vocabularyController.createVocab);
router.get("/GetAll", vocabularyController.getAllVocab);
router.get("/GetAllByTopicId", vocabularyController.GetAllByTopicId);
router.put("/update/:id", vocabularyController.updateVocab);
router.delete("/delete", vocabularyController.deleteVocabulary);

module.exports = router;
