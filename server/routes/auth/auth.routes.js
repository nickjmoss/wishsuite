const express = require('express');
const { createUser, loginUser } = require('@controllers/authenticationController');

const router = express.Router();

router.route('/create')
	.post(createUser);

router.route('/login')
	.post(loginUser);

module.exports = router;
