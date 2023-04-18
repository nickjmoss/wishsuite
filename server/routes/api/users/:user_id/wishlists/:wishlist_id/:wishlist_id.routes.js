const express = require('express');
const { deleteWishlist, fetchSingleWishlist, updateWishlist, publishWishlist, unpublishWishlist } = require('@controllers/wishlistController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.delete(deleteWishlist)
	.get(fetchSingleWishlist)
	.put(updateWishlist);

router.route('/publish')
	.put(publishWishlist);

router.route('/unpublish')
	.put(unpublishWishlist);

module.exports = router;
