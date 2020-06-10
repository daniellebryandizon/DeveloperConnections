const express = require('express');
const router = express.Router();

router.get('/api/profile', (request, response) => {
    response.send('Profile route');
});

module.exports = router;