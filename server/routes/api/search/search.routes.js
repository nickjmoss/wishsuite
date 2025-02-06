const express = require('express');
const { searchItems } = require('@controllers/searchController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(searchItems);

router.use('/:external_id', require('./:external_id/:external_id.routes'));

module.exports = router;
