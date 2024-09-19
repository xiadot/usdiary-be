const Diary = require('../models/diary');
const User = require('../models/user');
const { use } = require('../routes/diary');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const Like = require('../models/like');
const gainPoints = require('../controllers/point').gainPoints; // 포인트 획득 함수 가져오기

// 좋아요 누르기
exports.likeDiary = async (req, res) => {
    const signId = req.locals.decoded.sign_id; // 유저 아이디 가져오기

    try {
        const createLike = await Like.create({
            user_id: signId,
            diary_id: req.body.diary_id
        });

    // 이번 주에 사용자가 누른 좋아요 수 계산
    const startOfWeek = dayjs().startOf('week').toDate();
    const endOfWeek = dayjs().endOf('week').toDate();

    const likesThisWeek = await Like.count({
        where: {
            user_id: signId,
            createdAt: {
            [Op.between]: [startOfWeek, endOfWeek],
            },
        },
    });

    // 좋아요가 5개마다 1포인트 추가
    if (likesThisWeek % 5 === 0 && likesThisWeek / 5 <= 5) {
      // 포인트 획득 함수 호출
        await gainPoints(req, res, '일기에 좋아요');
        }

    req.status(201).json({
            message: 'Like created successfully',
            data: createLike
        });
    } catch (error) {
        console.error('Error creating like:', error);
        res.status(500).json({ error: 'An error occurred while creating the like' });
    }
};

// 좋아요 삭제
exports.deleteLike = async (req, res) => {
    const likeId = req.params.like_id;
    const signId = req.locals.decoded.sign_id;

    try {
        // 좋아요가 존재하는지 확인
        const like = await Like.findOne({
            where: {
                like_id: likeId,
                user_id: signId 
            }
        });
        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        // 좋아요 삭제
        await like.destroy();
        return res.status(200).json({ message: 'Like deleted successfully' });
    } catch (error) {
        console.error('Error deleting like:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}