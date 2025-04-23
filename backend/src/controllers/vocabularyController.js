const VocabModel = require("../models/vocabularyModel");

const vocabController = {
    //[POST] Create a new topic
    createVocab: async (req, res) => {
        try {
            const vocabId = await VocabModel.create(req.body); // Gọi trực tiếp model
            res.status(201).json({
                id: vocabId,
                message: "Vocabulary created successfully",
            });
        } catch (error) {
            console.error("Error in create Vocabulary:", error.message);
            res.status(400).send(error);
        }
    },
    // [GET] Get all topics
    getAllVocab: async (req, res) => {
        try {
            const [vocab] = await VocabModel.getAll({});
            res.status(200).send(vocab);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    updateVocab: async (req, res) => {
        try {
            const vocabId = req.params.id; // Lấy ID trước
            const { word, meaning, pronunciation, image_path, sound_path } =
                req.body;

            const vocabUpdated = await VocabModel.update(
                word,
                meaning,
                pronunciation,
                image_path,
                sound_path,
                vocabId
            );

            console.log(vocabUpdated);
            if (vocabUpdated.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ message: "Vocabulary not found !" });
            }

            // Lấy lại dữ liệu sau khi cập nhật
            const updatedVocab = await VocabModel.findByPk(vocabId);

            res.status(200).json("updatedVocab");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    deleteVocabulary: async (req, res) => {
        try {
            const vocab = await VocabModel.getById(req.body.id); // Lấy dữ liệu trước
            if (!vocab) {
                return res.status(404).json({ message: "Vocab not found" });
            }
            await VocabModel.delete(req.body.id);
            return res.status(204).send();
        } catch (error) {
            res.status(500).send(error);
        }
    },
    GetAllByTopicId: async (req, res) => {
        try {
            console.log(req.query.topic_id);
            const vocab = await VocabModel.getVocabByTopicId(req.query.topic_id);
            console.log(vocab);
            if (!vocab) {
                return res.status(404).send();
            }
            res.status(200).send(vocab);
        } catch (error) {
            res.status(500).send(error);
        }
    },
};

module.exports = vocabController;
