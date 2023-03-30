const express = require('express');
const { fetchWishlists, createWishlist } = require('@controllers/wishlistController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(fetchWishlists)
	.post(createWishlist);

module.exports = router;
