const express = require('express');
const { followFriend, unfollowFriend } = require('@controllers/friendsController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.post(followFriend)
	.delete(unfollowFriend);

module.exports = router;
