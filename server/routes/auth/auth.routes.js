const express = require('express');
const { createUser, loginUser, fetchSession } = require('@controllers/authenticationController');

const router = express.Router();

router.route('/create')
	.post(createUser);

router.route('/login')
	.post(loginUser);

router.route('/session')
	.get(fetchSession);

module.exports = router;
