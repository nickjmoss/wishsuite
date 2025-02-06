const express = require('express');
const { fetchFriends, fetchPotentialFriends } = require('@controllers/friendsController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(fetchFriends);

router.route('/potential')
	.get(fetchPotentialFriends);

router.use('/:friend_id', require('./:friend_id/:friend_id.routes.js'));

module.exports = router;
