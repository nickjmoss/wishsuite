const express = require('express');
const { fetchWishlists, createWishlist } = require('@controllers/wishlistController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(fetchWishlists)
	.post(createWishlist);

router.use('/:wishlist_id', require('./:wishlist_id/:wishlist_id.routes'));

module.exports = router;
