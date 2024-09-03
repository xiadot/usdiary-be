const express = require('express');
const router = express.Router();
const {getFriendDiaries,getFollowers,deleteFollowers, addFollowing, getFollowing,deleteFollowing, searchFriends, getFriends} = require('../controllers/friendlist');  // Controller 파일 가져오기
const { verifyToken } = require('../middlewares/jwt');

// 팔로워 목록 조회
router.get('/:sign_id/followers', verifyToken, getFollowers);
// 팔로워 삭제
router.delete('/:sign_id/followers/:follower_sign_id', verifyToken, deleteFollowers);

// 팔로잉 목록 조회
router.get('/:sign_id/followings', verifyToken, getFollowing);
// 팔로잉 삭제
router.delete('/:sign_id/:following_sign_id', verifyToken, deleteFollowing);
// 팔로잉 추가 (친구추가)
router.post('/:sign_id/followings', verifyToken, addFollowing);

// 친구 검색
router.get('/:sign_id/search', verifyToken, searchFriends);
// 친구 목록 조회
router.get('/:sign_id/friends', verifyToken, getFriends);
// 친구 게시글 조회
router.get('/:sign_id/followings/:following_sign_id/diaries', verifyToken, getFriendDiaries);

module.exports = router;
