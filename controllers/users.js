const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const dotenv = require('dotenv');

dotenv.config();

console.log('Users controller loaded.');

// 로그인
exports.login = async (req, res) => {
    const { sign_id, password } = req.body;

    console.log('Login function invoked. Request body:', req.body); 

    try {
        if (!sign_id || !password) {
            console.log('Missing credentials.');
            return res.status(400).json({ message: '아이디와 비밀번호는 필수 입력 사항입니다.' });
        }

        const user = await User.findOne({ where: { sign_id } });

        if (!user) {
            console.log('User not found.');
            return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
        }

        console.log('User found:', user.sign_id);

        const isPasswordValid = await bcrypt.compare(password, user.user_pwd);

        if (!isPasswordValid) {
            console.log('Invalid password.');
            return res.status(401).json({ message: '잘못된 비밀번호입니다.' });
        }

        console.log('Password validated successfully.');

        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // 토큰 24시간 만료
        );

        console.log('JWT token created:', token);

        res.json({ message: '로그인 성공', token });
    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        res.status(500).json({ message: '내부 서버 오류입니다.' });
    }
};