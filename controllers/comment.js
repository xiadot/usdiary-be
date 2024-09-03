const Comment = require('../models/comment');
const Diary = require('../models/diary');
const User = require('../models/user');

// 댓글 작성
exports.createComment = async (req, res) => {
    try {
        const diaryId = req.params.diary_id;
        const { content } = req.body;
        const userId = req.user.id; // 인증된 사용자의 ID를 가져오기

        // 해당 일기가 존재하는지 확인
        const diary = await Diary.findByPk(diaryId);
        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }

        // 새로운 댓글 생성
        const comment = await Comment.create({
            comment_text: content,
            user_id: userId,
            diary_id: diaryId
        });

        // 생성된 댓글 반환
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
    try {
        const { diaryId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // 인증된 사용자의 ID를 가져오기

        // 해당 일기가 존재하는지 확인
        const diary = await Diary.findByPk(diaryId);
        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }

        // 수정할 댓글이 존재하는지 확인
        const comment = await Comment.findOne({
            where: { comment_id: commentId, diary_id: diaryId, user_id: userId }
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or you do not have permission to edit this comment' });
        }

        // 댓글 내용 수정
        comment.content = content;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// 댓글 조회
exports.renderComments = async (req, res) => {
  try {
      const diaryId = req.params.diary_id;

      // 해당 일기에 대한 모든 댓글을 조회
      const comments = await Comment.findAll({
          where: { diary_id: diaryId },
          include: [
            { model: User, attributes: ['user_id', 'user_name'] },
          ],
          order: [['createdAt', 'ASC']]
      });

      if (!comments) {
          return res.status(404).json({ message: 'No comments found' });
      }
      
      res.json(comments);
  } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const commentId = req.params.comment_id;

  try {
      // 댓글이 존재하는지 확인
      const comment = await Comment.findByPk(commentId);

      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      await Comment.destroy({
          where: {
              comment_id: commentId
          }
      });

      return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
      console.error('Error deleting comment:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};
