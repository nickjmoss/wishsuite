const express = require('express');
const { editOccasion, deleteOccasion } = require('@controllers/occasionController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.put(editOccasion)
	.delete(deleteOccasion);

module.exports = router;
