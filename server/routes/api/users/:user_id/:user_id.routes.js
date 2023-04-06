const express = require('express');
const { fetchUser, updateUser, getSignature, deleteUser } = require('@controllers/userController');
const router = express.Router({ mergeParams: true });

router.route('/')
	.get(fetchUser)
	.post(updateUser)
	.delete(deleteUser);

router.route('/token')
	.get(getSignature);

router.use('/occasions', require('./occasions/occasions.routes.js'));
router.use('/wishlists', require('./wishlists/wishlists.routes.js'));
router.use('/friends', require('./friends/friends.routes.js'));
router.use('/items', require('./items/items.routes.js'));

module.exports = router;
