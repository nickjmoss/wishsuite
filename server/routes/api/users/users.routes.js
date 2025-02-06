const express = require('express');

const router = express.Router({ mergeParams: true });

router.use('/:user_id', require('./:user_id/:user_id.routes'));

module.exports = router;
