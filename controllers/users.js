const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const dotenv = require('dotenv');

dotenv.config();

// 로그인
exports.login = async (req, res) => {
    const { sign_id, password } = req.body;

    try {
        if (!sign_id || !password) {
            return res.status(400).json({ message: '아이디와 비밀번호는 필수 입력 사항입니다.' });
        }

        const user = await User.findOne({ where: { sign_id } });

        if (!user) {
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

        res.json({ message: '로그인 성공', token });
    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        res.status(500).json({ message: '내부 서버 오류입니다.' });
    }
};

// 아이디 찾기
exports.findId = async (req, res) => {
    const { user_name, user_email, user_birthday } = req.body;

    try {
        // 입력된 user_birthday를 문자열로 처리
        const formattedBirthday = typeof user_birthday === 'string'
            ? user_birthday.split('T')[0]  // 'T'로 나누고 날짜 부분만 사용
            : new Date(user_birthday).toISOString().split('T')[0]; // Date 객체라면 변환

        const user = await User.findOne({
            where: {
                user_name: user_name,
                user_email: user_email,
                user_birthday: formattedBirthday
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "사용자 정보와 일치하는 계정이 없습니다."
            });
        }

        res.status(200).json({
            message: `${user_name}님의 아이디입니다.`,
            sign_id: user.sign_id
        });

    } catch (error) {
        console.error('ID 찾기 중 오류 발생:', error);
        res.status(500).json({
            message: "서버 내부 오류"
        });
    }
};