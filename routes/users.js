const express = require('express');
const router = express.Router();
const { login, findId, findPwd } = require('../controllers/users');

// 로그인
router.post('/login', login);
// 아이디 찾기
router.post('/findId', findId);
//비밀번호 찾기
router.post('/findPwd', findPwd);

module.exports = router;