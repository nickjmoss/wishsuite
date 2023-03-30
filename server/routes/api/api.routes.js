const express = require('express');

const router = express.Router();

router.use('/users', require('./users/users.routes'));

module.exports = router;
