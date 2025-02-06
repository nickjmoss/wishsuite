const express = require('express');

const router = express.Router();

router.use('/users', require('./users/users.routes'));
router.use('/search', require('./search/search.routes'));

module.exports = router;
