const express = require('express');
const router = express.Router();
const { updateComment,createComment,renderComments, deleteComment } = require('../controllers/comment');

//댓글 조회 - 특정 일기에 대한 댓글 조회
router.get('/:diary_id/comments', renderComments);

// 댓글 작성 - 특정 일기에 댓글 작성
router.post('/:diary_id/comments', createComment);

// 댓글 수정 - 특정 댓글 수정
router.put('/:diary_id/comments/:comment_id', updateComment);

//댓글 삭제 - 특정 댓글 삭제
router.delete('/:diary_id/comments/:comment_id', deleteComment);

module.exports = router;
