const express = require('express');
const { getItemByExternalId } = require('@controllers/searchController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(getItemByExternalId);

module.exports = router;
