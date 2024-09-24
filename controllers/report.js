const Comment = require('../models/comment');
const Diary = require('../models/diary');
const Report = require('../models/report');

// 신고하기
exports.createReport = async (req, res) => {
    try {
        const signId = req.locals.decoded.sign_id; // 유저 아이디 가져오기
        // 요청에서 필요한 데이터 추출 (다이어리 아이디, 신고 유형, 신고 이유)
        const { diary_id, comment_id, report_type, report_reason } = req.body;

        // 신고된 다이어리 정보 가져오기
        const diary = await Diary.findOne({ where: { diary_id: diary_id } });

        if (!diary) {
            return res.status(404).json({ error: 'Diary not found' });
        }

        // 신고된 댓글 정보 가져오기
        const comment = await Comment.findOne({where: { comment_id: comment_id}});

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const reportedId = diary.user_id; // 다이어리 작성자의 유저 ID
        const commentId = comment.comment_id; // 신고한 댓글 ID

        // 신고 생성
        const createReport = await Report.create({
            reporter_id: signId,     // 신고한 유저 ID
            reported_id: reportedId, // 신고당한 유저 ID (다이어리 작성자)
            diary_id: diary_id,      // 신고된 다이어리 ID
            comment_id: commentId, // 신고된 댓글 ID
            report_type: report_type, // 신고 유형
            report_reason: report_reason // 신고 이유 (선택 사항)
        });

        // 신고당한 유저의 ban_count 증가
        const reportedUser = await User.findOne({ where: { user_id: reportedId } });
        if (reportedUser) {
            await reportedUser.increment('ban_count', { by: 1 }); // ban_count 1 증가
        }

        req.status(201).json({
            message: 'Report created successfully',
            data: createReport
        });
    } catch (error) {
        console.error('Error creating Report:', error);
        res.status(500).json({ error: 'An error occurred while creating the Report' });
    }
}