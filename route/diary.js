const express = require('express');
const { Diary, User, Board } = require('../models');

const router = express.Router();

// 최신순 정렬 라우트 (Latest)
router.get('/', async (req, res, next) => {
  try {
    const diaries = await Diary.findAll({
      include: [
        { model: User, attributes: ['user_id'] }, // 사용자 정보 포함
        { model: Board, attributes: ['board_name'] }, // 게시판 정보 포함
      ],
      order: [['createdAt', 'DESC']] // 최신순 정렬
    });

    console.log(diaries);
    res.render('diary', { diaries }); // EJS 파일 렌더링
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 조회수순 정렬 라우트 (Most Viewed)
router.get('/views', async (req, res, next) => {
  try {
    const diaries = await Diary.findAll({
      include: [
        { model: User, attributes: ['user_id'] }, // 사용자 정보 포함
        { model: Board, attributes: ['board_name'] }, // 게시판 정보 포함
      ],
      order: [['view_count', 'DESC']] // 조회수순 정렬
    });

    console.log(diaries);
    res.render('diary', { diaries }); // EJS 파일 렌더링
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 좋아요순 정렬 라우트 (Most Liked)
router.get('/likes', async (req, res, next) => {
  try {
    const diaries = await Diary.findAll({
      include: [
        { model: User, attributes: ['user_id'] }, // 사용자 정보 포함
        { model: Board, attributes: ['board_name'] }, // 게시판 정보 포함
      ],
      order: [['like_count', 'DESC']] // 좋아요순 정렬
    });

    console.log(diaries);
    res.render('diary', { diaries }); // EJS 파일 렌더링
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
