const express = require('express');
const { addItem } = require('@controllers/itemController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.post(addItem);

// router.use('/:item_id', require('./:item_id/:item_id.routes'));

module.exports = router;
