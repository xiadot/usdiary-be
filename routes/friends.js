const express = require('express');
const router = express.Router();
const {getFriendDiaries,getFollowers,deleteFollowers, addFollowing, getFollowing,deleteFollowing, searchFriends, getFriends} = require('../controllers/friendlist');  // Controller 파일 가져오기

// 팔로워 목록 조회
router.get('/:user_id/followers', getFollowers);
// 팔로워 삭제
router.delete('/:user_id/followers',deleteFollowers);

// 팔로잉 목록 조회
router.get('/:user_id/followings', getFollowing);
// 팔로잉 삭제
router.delete('/:user_id/followings',deleteFollowing);
// 팔로잉 추가 (친구추가)
router.post('/:sign_id/followings', addFollowing);

// 친구 검색
router.get('/:sign_id/search', searchFriends);
// 친구 목록 조회
router.get('/:user_id', getFriends);
// 친구 게시글 조회
router.get('/:user_id/followings/:following_id/diaries', getFriendDiaries);

module.exports = router;
