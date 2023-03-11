const express = require('express');
const { fetchUser, updateUser, getSignature } = require('@controllers/userController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(fetchUser)
	.post(updateUser);

router.route('/token')
	.get(getSignature);

module.exports = router;
