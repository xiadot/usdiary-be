const Comment = require('../models/comment');
const Diary = require('../models/diary');
const User = require('../models/user');

// 댓글 조회
exports.renderComments = async (req, res) => {
  try {
      const diaryId = req.params.diary_id;

      // 해당 일기에 대한 댓글을 모두 조회
      const comments = await Comment.findAll({
          where: { diary_id: diaryId },
          include: [
            { model: User, attributes: ['user_id', 'username'] },
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

      // 댓글 삭제
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
