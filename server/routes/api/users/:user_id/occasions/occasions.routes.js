const express = require('express');
const { createOccasion, getAllOccasions } = require('@controllers/occasionController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(getAllOccasions)
	.post(createOccasion);

router.use('/:occasion_id', require('./:occasion_id/:occasion_id.routes.js'));

module.exports = router;
