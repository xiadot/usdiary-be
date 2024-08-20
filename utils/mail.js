require('dotenv').config();
const nodemailer = require('nodemailer');
const SENDER_NAME = 'USDIARY'

const getEmailData = (to, authCode) => {
    return {
        from: `${SENDER_NAME} <${process.env.EMAIL_USER}>`, 
        to: to,
        subject: 'USDIARY 이메일 인증코드',
        html: `<p>인증코드는 <strong>${authCode}</strong> 입니다.</p>`
    };
};

const sendVerificationEmail = async (to, authCode) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = getEmailData(to, authCode);

        console.log('Mail Options:', mailOptions);

        if (!mailOptions.to) {
            throw new Error('No recipients defined'); 
        }

        await transporter.sendMail(mailOptions);
        console.log('이메일이 성공적으로 전송되었습니다.');
    } catch (error) {
        console.error('이메일 전송에 오류가 있습니다.:', error);
    }
};

module.exports = { sendVerificationEmail };
