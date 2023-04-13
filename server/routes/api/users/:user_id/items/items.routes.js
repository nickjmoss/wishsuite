const express = require('express');
const { addItem, fetchItems, deleteItems, copyItems } = require('@controllers/itemController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.post(addItem)
	.get(fetchItems);

router.route('/delete')
	.post(deleteItems);

router.route('/copy')
	.post(copyItems);

// router.use('/:item_id', require('./:item_id/:item_id.routes'));

module.exports = router;
