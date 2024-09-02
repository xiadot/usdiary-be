const Friend = require('../models/friend');
const User = require('../models/user');

// 맞팔 관계
exports.getFriends = async (req, res) => {
    try {
        const userId = req.params.user_id;
        console.log(userId)
        // 팔로우 중인 유저 목록 조회 (팔로잉)
        const following = await Friend.findAll({
            where: { follower_id: userId },
            attributes: ['following_id']
        });

        // 나를 팔로우 중인 유저 목록 조회 (팔로워)
        const followers = await Friend.findAll({
            where: { following_id: userId },
            attributes: ['follower_id']
        });

        // 친구 목록 (팔로우와 팔로워 관계가 일치하는 유저)
        const friends = following
            .map(f => f.following_id)
            .filter(followingId => followers.some(f => f.follower_id === followingId));

        // 친구 목록에 해당하는 유저 정보 조회
        const friendUsers = await User.findAll({
            where: { user_id: friends },
            
        });

        res.status(200).json({
            message: 'Friend list retrieved successfully',
            data: friendUsers
        });
    } catch (error) {
        console.error('Error retrieving friend list:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the friend list' });
    }
};
// 1. 팔로워 목록 조회
exports.getFollowers = async (req, res) => {
    try {
        const userId = req.params.user_id;  // 조회할 유저의 ID

        // 나를 팔로우 중인 유저 목록 조회
        const followers = await Friend.findAll({
            where: { following_id: userId },
            include: [{
                model: User,  // 팔로워 유저 정보
                as: 'Follower',  // 팔로워 유저와의 관계 (별칭)
                attributes: ['user_id', 'user_name', 'user_tendency']
            }]
        });

        if (!followers.length) {
            return res.status(404).json({ message: 'No followers found' });
        }

        const followerList = followers.map(f => f.Follower);

        res.status(200).json({
            message: 'Follower list retrieved successfully',
            data: followerList
        });
    } catch (error) {
        console.error('Error retrieving followers:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the followers' });
    }
};
// 2. 팔로잉 목록 조회
exports.getFollowing = async (req, res) => {
    try {
        const userId = req.params.user_id;  // 조회할 유저의 ID

        // 내가 팔로우 중인 유저 목록 조회
        const following = await Friend.findAll({
            where: { follower_id: userId },
            include: [{
                model: User,  // 팔로우된 유저 정보
                as: 'Following',  // 팔로우된 유저와의 관계 (별칭)
                attributes: ['user_id', 'user_name', 'user_tendency']
            }]
        });

        if (!following.length) {
            return res.status(404).json({ message: 'No following found' });
        }

        const followingList = following.map(f => f.Following);

        res.status(200).json({
            message: 'Following list retrieved successfully',
            data: followingList
        });
    } catch (error) {
        console.error('Error retrieving following:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the following list' });
    }
};
