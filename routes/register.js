const express = require('express');
const router = express.Router();
const {
    sendVerificationEmail,
    sendVerificationCode,
    verifyCode, 
    register,
    checkid,
    duplication
} = require('../controllers/register'); 

// 회원 가입
router.post('/register', register);

//이메일 인증
router.post('/verify-email', sendVerificationEmail);

// 이메일 인증 코드 전송
router.post('/send-verification-code', sendVerificationCode);

// 인증 코드 확인
router.post('/verify-code', verifyCode); 

// 아이디 중복 확인
router.get('/idcheck', checkid);

// 중복 확인
router.post('/duplication', duplication);

module.exports = router;
