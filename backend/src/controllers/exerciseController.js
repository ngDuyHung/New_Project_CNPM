const Exercise = require('../models/ExerciseModel.js');
const PracticeHistory = require('../models/PracticeHistoryModel.js');

const exercise = {
    // Tạo danh sách bài tập theo type
    createExercises: async (req, res) => {
        try {
            const { topicId, type, exercises } = req.body;
            const userId = req.user.id;

            // Validate dữ liệu đầu vào
            if (!topicId || !type || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin và danh sách bài tập'
                });
            }
            // Validate type
            const validTypes = ['flashcard', 'dienkhuyet', 'nghenoi', 'viet'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: `Loại bài tập không hợp lệ: ${type}`
                });
            }

            const createdExercises = [];

            // Tạo bài tập mới với user_id
            const exerciseId = await Exercise.createExercise(topicId, type, userId);

            // Xử lý nội dung tùy theo loại bài tập
            switch (type) {
                case 'flashcard':
                    for (const content of exercises) {
                        await Exercise.createFlashcard(
                            exerciseId,
                            content.imageUrl,
                            content.engWord,
                            content.vieWord
                        );
                    }
                    break;

                case 'dienkhuyet':
                    for (const content of exercises) {
                        await Exercise.createDienKhuyet(
                            exerciseId,
                            content.sentence,
                            content.correctAnswer,
                            content.answer1,
                            content.answer2,
                            content.answer3
                        );
                    }
                    break;

                case 'nghenoi':
                    for (const content of exercises) {
                        await Exercise.createNgheNoi(
                            exerciseId,
                            content.questionText
                        );
                    }
                    break;

                case 'viet':
                    for (const content of exercises) {
                        await Exercise.createViet(
                            exerciseId,
                            content.engWord,
                            content.vieWord
                        );
                    }
                    break;
            }

            createdExercises.push({ exerciseId, type });

            res.status(201).json({
                success: true,
                data: { exercises: createdExercises },
                message: 'Tạo bài tập thành công'
            });

        } catch (error) {
            console.error('Lỗi khi tạo bài tập:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi tạo bài tập'
            });
        }
    },

    // Lấy danh sách bài tập theo topic
    getExercisesByTopic: async (req, res) => {
        try {
            const { topicId } = req.params;
            const userId = req.user.id;
            
            const exercises = await Exercise.getExercisesByTopic(topicId, userId,type);
            
            // Chỉ lấy chi tiết cho bài tập của user hiện tại
            const exercisesWithDetails = await Promise.all(
                exercises.map(async (exercise) => {
                    const exerciseId =exercise.id;
                    let details = [];
                    switch (type) {
                        case 'flashcard':
                            details = await Exercise.getFlashcardsByExercise(exerciseId, userId);
                            break;
                        case 'dienkhuyet':
                            details = await Exercise.getDienKhuyetByExercise(exerciseId, userId);
                            break;
                        case 'nghenoi':
                            details = await Exercise.getNgheNoiByExercise(exerciseId, userId);
                            break;
                        case 'viet':
                            details = await Exercise.getVietByExercise(exerciseId, userId);
                            break;
                    }      
                    return { ...exercise, details };
                })
            );

            res.status(200).json({
                success: true,
                data: exercisesWithDetails
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy danh sách bài tập'
            });
        }
    },

    // Lấy chi tiết một bài tập
    getExerciseById: async (req, res) => {
        try {
            const { exerciseId } = req.params;
            const userId = req.user.id;

            const exercise = await Exercise.getExerciseById(exerciseId, userId);

            if (!exercise) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy bài tập'
                });
            }

            let details = [];
            switch (exercise.type) {
                case 'flashcard':
                    details = await Exercise.getFlashcardsByExercise(exerciseId, userId);
                    break;
                case 'dienkhuyet':
                    details = await Exercise.getDienKhuyetByExercise(exerciseId, userId);
                    break;
                case 'nghenoi':
                    details = await Exercise.getNgheNoiByExercise(exerciseId, userId);
                    break;
                case 'viet':
                    details = await Exercise.getVietByExercise(exerciseId, userId);
                    break;
            }

            res.status(200).json({
                success: true,
                data: { ...exercise, details }
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Cập nhật bài tập
    updateExercise: async (req, res) => {
        try {
            const { exerciseId } = req.params;
            const { type, content } = req.body;
            const userId = req.user.id;
            const updated = await Exercise.updateExercise(exerciseId, type, content, userId);
            
            if (!updated) {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn không có quyền cập nhật bài tập này'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật thành công'
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Xóa bài tập
    deleteExercise: async (req, res) => {
        try {
            const { exerciseId } = req.params;

            // Kiểm tra bài tập có tồn tại không
            const exercise = await Exercise.getExerciseById(exerciseId);
            if (!exercise) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy bài tập'
                });
            }

            // Xóa bài tập
            await Exercise.deleteExercise(exerciseId);

            res.status(200).json({
                success: true,
                message: 'Xóa bài tập thành công'
            });

        } catch (error) {
            console.error('Lỗi khi xóa bài tập:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi xóa bài tập'
            });
        }
    },

    // Update specific exercise content
    updateExerciseContent: async (req, res) => {
        try {
            const { id, type } = req.params;
            const content = req.body;
            const userId = req.user.id;

            // Validate type
            const validTypes = ['flashcard', 'dienkhuyet', 'nghenoi', 'viet'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: `Loại bài tập không hợp lệ: ${type}`
                });
            }

            switch (type) {
                case 'flashcard':
                    const { imageUrl, engWord, vieWord } = content;
                    if (!imageUrl || !engWord || !vieWord) {
                        return res.status(400).json({
                            success: false,
                            message: 'Thiếu thông tin cần thiết cho flashcard'
                        });
                    }
                    await Exercise.updateFlashcard(id, imageUrl, engWord, vieWord, userId);
                    break;

                case 'dienkhuyet':
                    const { sentence, correctAnswer, answer1, answer2, answer3 } = content;
                    if (!sentence || !correctAnswer || !answer1 || !answer2 || !answer3) {
                        return res.status(400).json({
                            success: false,
                            message: 'Thiếu thông tin cần thiết cho điền khuyết'
                        });
                    }
                    await Exercise.updateDienKhuyet(id, sentence, correctAnswer, answer1, answer2, answer3, userId);
                    break;

                case 'nghenoi':
                    const { questionText } = content;
                    if (!questionText) {
                        return res.status(400).json({
                            success: false,
                            message: 'Thiếu thông tin cần thiết cho nghe nói'
                        });
                    }
                    await Exercise.updateNgheNoi(id, questionText, userId);
                    break;

                case 'viet':
                    const { engWord: engWordViet, vieWord: vieWordViet } = content;
                    if (!engWordViet || !vieWordViet) {
                        return res.status(400).json({
                            success: false,
                            message: 'Thiếu thông tin cần thiết cho viết'
                        });
                    }
                    await Exercise.updateViet(id, engWordViet, vieWordViet, userId);
                    break;
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật nội dung bài tập thành công'
            });

        } catch (error) {
            console.error('Lỗi khi cập nhật nội dung bài tập:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi cập nhật nội dung bài tập'
            });
        }
    },

    // Delete specific exercise content
    deleteExerciseContent: async (req, res) => {
        try {
            const { id, type } = req.params;
            const userId = req.user.id;

            // Validate type
            const validTypes = ['flashcard', 'dienkhuyet', 'nghenoi', 'viet'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: `Loại bài tập không hợp lệ: ${type}`
                });
            }

            switch (type) {
                case 'flashcard':
                    await Exercise.deleteFlashcard(id, userId);
                    break;
                case 'dienkhuyet':
                    await Exercise.deleteDienKhuyet(id, userId);
                    break;
                case 'nghenoi':
                    await Exercise.deleteNgheNoi(id, userId);
                    break;
                case 'viet':
                    await Exercise.deleteViet(id, userId);
                    break;
            }

            res.status(200).json({
                success: true,
                message: 'Xóa nội dung bài tập thành công'
            });

        } catch (error) {
            console.error('Lỗi khi xóa nội dung bài tập:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi xóa nội dung bài tập'
            });
        }
    }
};

module.exports = exercise; 
