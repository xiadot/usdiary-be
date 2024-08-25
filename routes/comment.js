const express = require('express');
const router = express.Router();
const { renderComments, deleteComment } = require('../controllers/comment');

//댓글 조회 - 특정 일기에 대한 댓글 조회
router.get('/:diary_id/comments', renderComments);

//댓글 삭제 - 특정 댓글 삭제
router.delete('/comments/:comment_id', deleteComment);

module.exports = router;
