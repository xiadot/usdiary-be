const express = require('express');
const router = express.Router();
const { createTodo,getTodo,updateTodo,deleteTodo,
        createRoutine,getRoutine,updateRoutine,deleteRoutine,
        createQuestion,
        createAnswer, updateAnswer,deleteAnswer
      }= require('../controllers/content');
const { verifyToken } = require('../middlewares/jwt');

// Todo 
router.post('/todos', createTodo);
router.get('/todos/:todo_id', getTodo);
router.patch('/todos/:todo_id', updateTodo);
router.delete('/todos/:todo_id', deleteTodo);
// Routine 
router.post('/routines', createRoutine);
router.get('/routines/:routine_id', getRoutine);
router.patch('/routines/:routine_id', updateRoutine);
router.delete('/routines/:routine_id', deleteRoutine);

// TodayQuestion
router.post('/questions', verifyToken, createQuestion);

// TodayAnswer
router.post('/questions/:question_id/answers', verifyToken, createAnswer);
router.patch('/questions/:question_id/answers/:answer_id', verifyToken, updateAnswer);
router.delete('/questions/:question_id/answers/:answer_id', verifyToken, deleteAnswer);

module.exports = router;
