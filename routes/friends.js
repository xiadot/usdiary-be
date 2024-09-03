const express = require('express');
const router = express.Router();
const {getFollowers,getFollowing,getFriends} = require('../controllers/friendlist');  // Controller 파일 가져오기

// 팔로워 목록 조회
router.get('/:user_id/followers', getFollowers);

// 팔로잉 목록 조회
router.get('/:user_id/followings', getFollowing);

// 친구 목록 조회
router.get('/:user_id', getFriends);

module.exports = router;
