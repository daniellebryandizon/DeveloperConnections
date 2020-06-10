const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.get('/', auth, (request, response) => {
    response.send('Auth route');
});

module.exports = router;