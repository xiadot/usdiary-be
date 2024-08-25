const Routine = require('../models/routine');
const Todo  = require('../models/todos'); 
const TodayQuestion = require('../models/today_questions'); 
const TodayAnswer = require('../models/today_answers'); 


// Todo 
const MAX_TODOS_PER_DIARY = 5
exports.createTodo = async (req, res) => {
    const { diary_id, description, is_completed } = req.body;

    try {
       
        const todoCount = await Todo.count({
            where: { diary_id: diary_id }
        });

        // 투두가 해당 일기에서 최대 개수를 넘었는지 확인
        if (todoCount > MAX_TODOS_PER_DIARY-1) {
            return res.status(400).json({
                message: `You can only create up to ${MAX_TODOS_PER_DIARY} todos for this diary.`
            });
        }

        // 투두 생성
        const newTodo = await Todo.create({
            description,
            is_completed,
            diary_id,
        });

        res.status(201).json({
            message: 'Todo created successfully',
            data: newTodo
        });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'An error occurred while creating the todo' });
    }
};

exports.getTodo = async (req, res) => {
    const { todo_id } = req.params;
    try {
        const todo = await Todo.findByPk(todo_id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({
            message: 'Todo retrieved successfully',
            data: todo
        });
    } catch (error) {
        console.error('Error retrieving todo:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the todo' });
    }
};


exports.updateTodo = async (req, res) => {
    const { todo_id } = req.params;
    try {
        const todo = await Todo.findByPk(todo_id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.description = req.body.description !== undefined ? req.body.description : todo.description;
        todo.is_completed = req.body.is_completed !== undefined ? req.body.is_completed : todo.is_completed;

        await todo.save();

        res.status(200).json({
            message: 'Todo updated successfully',
            data: todo
        });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'An error occurred while updating the todo' });
    }
};


exports.deleteTodo = async (req, res) => {
    const { todo_id } = req.params;
    try {
        const todo = await Todo.findByPk(todo_id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await todo.destroy();

        res.status(200).json({
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'An error occurred while deleting the todo' });
    }
};
// routine
const MAX_ROUTINES_PER_USER = 3; //루틴 개수 제한

exports.createRoutine = async (req, res) => {
    const userId = req.body.user_id;

    try {
        
        const routineCount = await Routine.count({
            where: { user_id: userId }
        });

       
        if (routineCount > MAX_ROUTINES_PER_USER-1) {
            return res.status(400).json({
                message: `You can only create up to ${MAX_ROUTINES_PER_USER} routines.`
            });
        }

        // 루틴 생성
        const newRoutine = await Routine.create({
            description: req.body.description,
            is_completed: req.body.is_completed || false,
            diary_id: req.body.diary_id,
            user_id: userId,
        });

        res.status(201).json({
            message: 'Routine created successfully',
            data: newRoutine
        });
    } catch (error) {
        console.error('Error creating routine:', error);
        res.status(500).json({ error: 'An error occurred while creating the routine' });
    }
};
exports.getRoutine = async (req, res) => {
    const { routine_id } = req.params;
    try {
        const routine = await Routine.findByPk(routine_id);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        res.status(200).json({
            message: 'Routine retrieved successfully',
            data: routine
        });
    } catch (error) {
        console.error('Error retrieving routine:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the routine' });
    }
};
exports.updateRoutine = async (req, res) => {
    const { routine_id } = req.params;
    const { description, is_completed } = req.body;

    try {
        const routine = await Routine.findByPk(routine_id);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        routine.description = description !== undefined ? description : routine.description;
        routine.is_completed = is_completed !== undefined ? is_completed : routine.is_completed;

        await routine.save();

        res.status(200).json({
            message: 'Routine updated successfully',
            data: routine
        });
    } catch (error) {
        console.error('Error updating routine:', error);
        res.status(500).json({ error: 'An error occurred while updating the routine' });
    }
};
exports.deleteRoutine = async (req, res) => {
    const { routine_id } = req.params;

    try {
        const routine = await Routine.findByPk(routine_id);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        await routine.destroy();

        res.status(200).json({
            message: 'Routine deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting routine:', error);
        res.status(500).json({ error: 'An error occurred while deleting the routine' });
    }
};

// TodayQuestion 생성
exports.createQuestion = async (req, res) => {
    try { 
        const { question_text } = req.body;
        const userId = res.locals.decoded.userId; // JWT에서 가져온 사용자 ID
        
        const newQuestion = await TodayQuestion.create({
            question_text,
            user_id: userId // 질문 생성 시 사용자 ID를 저장
        });
            
        res.status(201).json({
            message: '질문이 생성되었습니다.',
            data: newQuestion
        });
    } catch (error) {
        console.error('질문 생성 중 오류 발생:', error);
        res.status(500).json({ message: 'Failed to create question' });
    }
};

// TodayAnswer 등록
exports.createAnswer = async (req, res) => {
    try {
        const { question_id } = req.params;
        const { answer_text } = req.body;
        const userId = res.locals.decoded.userId;

        const question = await TodayQuestion.findByPk(question_id);
        if (!question) {
            return res.status(404).json({ message: '질문을 찾을 수 없습니다.' });
        }
        
        if (question.user_id !== userId) {
            return res.status(403).json({ message: '이 질문에 답변할 권한이 없습니다.' });
        }

        const newAnswer = await TodayAnswer.create({
            question_id,
            answer_text,
            user_id: userId
        });

        res.status(201).json({
            message: '답변이 등록되었습니다.',
            data: newAnswer
        });

    } catch (error) {
        console.error('답변 등록 중 오류 발생:', error);
        res.status(500).json({ message: 'Failed to create answer' });
    }
};

// TodayAnswer 수정
exports.updateAnswer = async (req, res) => {
    try {
        const { question_id, answer_id } = req.params;
        const { answer_text } = req.body;
        const userId = res.locals.decoded.userId; 

        const answer = await TodayAnswer.findOne({
            where: {
                answer_id,
                question_id,
                user_id: userId 
            },
        });
    
        if (!answer) {
            return res.status(404).json({ message: '답변을 찾을 수 없습니다.' });
        }

        if (answer.user_id !== userId) {
            return res.status(403).json({ message: '이 답변을 수정할 권한이 없습니다.' });
        }
    
        answer.answer_text = answer_text;
        await answer.save();
    
        res.status(200).json({
            message: '답변이 수정되었습니다.',
            data: answer
        });

    } catch (error) {
        console.error('답변 수정 중 오류 발생:', error);   
        res.status(500).json({ message: 'Failed to update answer' });
    }
};
