const express = require('express');
const { createOccasion } = require('@controllers/occasionController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.post(createOccasion);

module.exports = router;
