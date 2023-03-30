const express = require('express');

const router = express.Router();

router.use('/api/auth', require('@auth/auth.routes.js'));
router.use('/api', require('@api/api.routes.js'));

module.exports = router;
