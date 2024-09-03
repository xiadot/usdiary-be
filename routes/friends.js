const express = require('express');
const router = express.Router();
const {getFollowers,deleteFollowers,getFollowing,deleteFollowing,getFriends} = require('../controllers/friendlist');  // Controller 파일 가져오기

// 팔로워 목록 조회
router.get('/:user_id/followers', getFollowers);
//팔로워 삭제
router.delete('/:user_id/followers',deleteFollowers)

// 팔로잉 목록 조회
router.get('/:user_id/followings', getFollowing);
//팔로잉 삭제
router.delete('/:user_id/followings',deleteFollowing)

// 친구 목록 조회
router.get('/:user_id', getFriends);

module.exports = router;
