const Diary = require('../models/diary');
const User = require('../models/user');
const Board = require('../models/board');

//일기 조회
// handlers.js
exports.renderDiary = async (req, res) => {
  try {
      const diaryId = req.params.diary_id;
      const diary = await Diary.findByPk(diaryId);

      if (!diary) {
          return res.status(404).json({ message: 'Diary not found' });
      }
      console.log(diary)
      res.json(diary);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

//일기 작성
exports.createDiary = (req, res) => {
  const newDiary = {
      diary_title: req.body.diary_title,
      diary_content: req.body.diary_content,
      diary_cate: req.body.diary_cate,
      access_level: req.body.access_level,
      board_id: req.body.board_id,
      diary_emotion: req.body.diary_emotion,
      cate_num: req.body.cate_num,
      post_photo: req.file ? req.file.path : null
  };
  console.log(newDiary)
  // 예시 응답 데이터
  res.status(201).json({
      message: 'Diary created',
      data: newDiary
  });
};
exports.updateDiary = async (req, res) => {
    const { diary_id } = req.params;
    const {
      diary_title,
      diary_content,
      diary_cate,
      access_level,
      diary_emotion,
      cate_num,
    } = req.body;
  
    try {
      // 다이어리 항목 찾기
      const diary = await Diary.findByPk(diary_id);
  
      if (!diary) {
        return res.status(404).json({ message: 'Diary not found' });
      }
  
      // 다이어리 항목 업데이트
      const updatedDiary = await diary.update({
        diary_title: diary_title || diary.diary_title,
        diary_content: diary_content || diary.diary_content,
        diary_cate: diary_cate || diary.diary_cate,
        access_level: access_level || diary.access_level,
        diary_emotion: diary_emotion || diary.diary_emotion,
        cate_num: cate_num || diary.cate_num,
        post_photo: req.file ? req.file.path : diary.post_photo,
      });
  
      // 성공적으로 업데이트된 다이어리 항목 반환
      res.status(200).json({
        message: 'Diary updated successfully',
        data: updatedDiary,
      });
    } catch (error) {
      console.error('Error updating diary:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// 일기 삭제 
exports.deleteDiary = async (req, res) => {
    const diaryId = req.params.diary_id;

    try {
        // 일기가 존재하는지 확인
        const diary = await Diary.findByPk(diaryId);

        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }

        // 일기 삭제
        await Diary.destroy({
            where: {
                diary_id: diaryId
            }
        });

        return res.status(200).json({ message: 'Diary deleted successfully' });
    } catch (error) {
        console.error('Error deleting diary:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// 일기 목록 정렬 (최신순)
exports.sortDiary = async (req, res) => {
  try {
      const { page = 1, limit = 15 } = req.query;  // 페이지와 항목 수 쿼리로 받아옴
      const offset = (page - 1) * limit;

      const diary = await Diary.findAll({
          include: {
              model: User,
              attributes: ['user_id'],
          },
          order: [['createdAt', 'DESC']],
          limit: parseInt(limit),  // 항목 수 제한
          offset: offset,          // 시작 지점 설정
      });

      console.log(diary);
      res.json(diary);
  } catch (error) {
    console.error('Error sorting diary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const { Op } = require('sequelize');

// 주간 조회수 정렬
exports.sortWeeklyViews = async (req, res) => {
  try {
      const { page = 1, limit = 15 } = req.query;
      const offset = (page - 1) * limit;

      // 현재 주의 시작과 끝 날짜 계산 (일요일부터 토요일)
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const diary = await Diary.findAll({
        include: [
          { model: User, attributes: ['user_id'] },
          { model: Board, attributes: ['board_name'] },
        ],
        where: {
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek] // 주간 범위 설정
          }
        },
        order: [['view_count', 'DESC']],
        limit: parseInt(limit),
        offset: offset,
      });

      console.log(diary);
      res.json(diary);
  } catch (error) {
    console.error('Error sorting weekly views:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// 주간 좋아요 정렬
exports.sortWeeklyLikes = async (req, res) => {
  try {
      const { page = 1, limit = 15 } = req.query;
      const offset = (page - 1) * limit;

      // 현재 주의 시작과 끝 날짜 계산 (일요일부터 토요일)
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const diary = await Diary.findAll({
        include: [
          { model: User, attributes: ['user_id'] },
          { model: Board, attributes: ['board_name'] },
        ],
        where: {
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek] // 주간 범위 설정
          }
        },
        order: [['like_count', 'DESC']],
        limit: parseInt(limit),
        offset: offset,
      });

      console.log(diary);
      res.json(diary);
  } catch (error) {
    console.error('Error sorting weekly likes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
