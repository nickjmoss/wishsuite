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

module.exports = router;
