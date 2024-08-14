const express = require('express');
const router = express.Router();
const { login, findId } = require('../controllers/users');

// 로그인
router.post('/login', login);
// 아이디 찾기
router.post('/findId', findId);

module.exports = router;