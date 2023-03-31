const express = require('express');
const { deleteWishlist } = require('@controllers/wishlistController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.delete(deleteWishlist);

module.exports = router;
