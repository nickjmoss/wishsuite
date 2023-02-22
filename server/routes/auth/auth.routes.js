const express = require('express');
const { createUser, loginUser, fetchSession, logoutUser, resetPassword } = require('@controllers/authenticationController');

const router = express.Router();

router.route('/create')
	.post(createUser);

router.route('/login')
	.post(loginUser);

router.route('/session')
	.get(fetchSession);

router.route('/logout')
	.post(logoutUser);

router.route('/reset-password')
	.post(resetPassword);

module.exports = router;
