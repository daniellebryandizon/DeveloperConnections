const express = require('express');
const router = express.Router();

router.get('/api/auth', (request, response) => {
    response.send('Auth route');
});

module.exports = router;