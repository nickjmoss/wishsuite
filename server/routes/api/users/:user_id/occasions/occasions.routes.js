const express = require('express');
const { createOccasion, getAllOccasions } = require('@controllers/occasionController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(getAllOccasions)
	.post(createOccasion);

module.exports = router;
