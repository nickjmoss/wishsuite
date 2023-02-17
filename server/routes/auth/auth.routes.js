const express = require('express');
const { createUser, loginUser, fetchSession, logoutUser } = require('@controllers/authenticationController');

const router = express.Router();

router.route('/create')
	.post(createUser);

router.route('/login')
	.post(loginUser);

router.route('/session')
	.get(fetchSession);

router.route('/logout')
	.post(logoutUser);

module.exports = router;
