const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.send('Profile route');
});

module.exports = router;