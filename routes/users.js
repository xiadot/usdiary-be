const express = require('express');
const router = express.Router();
const { login, findId, findPwd, getLoginPage, googleCallback } = require('../controllers/users');

// 로그인
router.post('/login', login);
// 아이디 찾기
router.post('/findId', findId);
//비밀번호 찾기
router.post('/findPwd', findPwd);

// Google 로그인 페이지 렌더링
router.get('/login/google', getLoginPage);
// Google OAuth 2.0 콜백 처리
router.get('/login/google/callback', googleCallback);

module.exports = router;