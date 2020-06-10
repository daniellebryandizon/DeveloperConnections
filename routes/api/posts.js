const express = require('express');
const router = express.Router();

router.get('/api/posts', (request, response) => {
    response.send('Posts route');
});

module.exports = router;