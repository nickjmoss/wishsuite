const express = require('express');
const { followFriend, unfollowFriend, fetchSingleFriend } = require('@controllers/friendsController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.post(followFriend)
	.delete(unfollowFriend)
	.get(fetchSingleFriend);

module.exports = router;
