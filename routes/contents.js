const express = require('express');
const router = express.Router();
const { createTodo,getTodo,updateTodo,deleteTodo,
        createRoutine,getRoutine,updateRoutine,deleteRoutine,
        createQuestion,
        createAnswer, updateAnswer,deleteAnswer
      }= require('../controllers/content');
const { verifyToken } = require('../middlewares/jwt');

// Todo 
router.post('/todos', verifyToken, createTodo);
router.get('/todos/:todo_id', verifyToken, getTodo);
router.patch('/todos/:todo_id', verifyToken, updateTodo);
router.delete('/todos/:todo_id', verifyToken, deleteTodo);
// Routine 
router.post('/routines', verifyToken, createRoutine);
router.get('/routines/:routine_id', verifyToken, getRoutine);
router.patch('/routines/:routine_id', verifyToken, updateRoutine);
router.delete('/routines/:routine_id', verifyToken, deleteRoutine);

// TodayQuestion
router.post('/questions', verifyToken, createQuestion);

// TodayAnswer
router.post('/questions/:question_id/answers', verifyToken, createAnswer);
router.patch('/questions/:question_id/answers/:answer_id', verifyToken, updateAnswer);
router.delete('/questions/:question_id/answers/:answer_id', verifyToken, deleteAnswer);

module.exports = router;
