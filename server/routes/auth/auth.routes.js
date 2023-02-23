const express = require('express');
const { createUser, loginUser, fetchSession, logoutUser, forgotPassword, verifyToken, newPassword } = require('@controllers/authenticationController');

const router = express.Router();

router.route('/create')
	.post(createUser);

router.route('/login')
	.post(loginUser);

router.route('/session')
	.get(fetchSession);

router.route('/logout')
	.post(logoutUser);

router.route('/forgot-password')
	.post(forgotPassword);

router.route('/verify-token')
	.post(verifyToken);

router.route('/new-password')
	.post(newPassword);

module.exports = router;
