const express = require('express');
const { addItem, fetchItems, deleteItems, copyItems, updateItemStatus, reserveItems, unreserveItems } = require('@controllers/itemController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.post(addItem)
	.get(fetchItems);

router.route('/delete')
	.post(deleteItems);

router.route('/copy')
	.post(copyItems);

router.route('/reserve')
	.put(reserveItems);

router.route('/unreserve')
	.put(unreserveItems);

router.route('/status')
	.put(updateItemStatus);

// router.use('/:item_id', require('./:item_id/:item_id.routes'));

module.exports = router;
