const express = require('express');
const router = express.Router();
const exercise = require('../controllers/exerciseController');
const auth = require('../middleware/auth');


// Routes
router.post('/', auth, exercise.createExercises);
router.get('/topic/:topicId', auth, exercise.getExercisesByTopic);
router.get('/:exerciseId', auth, exercise.getExerciseById);
router.put('/update/:id/:type', auth, exercise.updateExerciseContent);
router.delete('/delete/:id/:type', auth, exercise.deleteExerciseContent);

module.exports = router; 



// Body:
// {
//     "topicId": 1,
//     "type": "flashcard",
//     "exercises": [
//         {
//             "imageUrl": "https://example.com/image.jpg",
//             "engWord": "cat",
//             "vieWord": "con mèo"
//         },
//         {
//             "imageUrl": "https://example.com/image2.jpg",
//             "engWord": "dog",
//             "vieWord": "con chó"
//         }
//     ]
// }


// Body:
// {
//     "topicId": 1,
//     "type": "dienkhuyet",
//     "exercises": [
//         {
//             "sentence": "The cat ___ on the mat.",
//             "correctAnswer": "sits",
//             "answer1": "sit",
//             "answer2": "sat",
//             "answer3": "sitting"
//         },
//         {
//             "sentence": "She ___ to school every day.",
//             "correctAnswer": "goes",
//             "answer1": "go",
//             "answer2": "went",
//             "answer3": "going"
//         }
//     ]
// }


// Body:
// {
//     "topicId": 1,
//     "type": "nghenoi",
//     "exercises": [
//         {
//             "questionText": "What is your name?"
//         },
//         {
//             "questionText": "How are you today?"
//         }
//     ]
// }

// Body:
// {
//     "topicId": 1,
//     "type": "viet",
//     "exercises": [
//         {
//             "engWord": "beautiful",
//             "vieWord": "xinh đẹp"
//         },
//         {
//             "engWord": "happy",
//             "vieWord": "hạnh phúc"
//         }
//     ]
// }
