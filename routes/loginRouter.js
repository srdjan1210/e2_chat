const express = require('express');
const router = express.Router();


router.post('/', (req, res) => {
    res.json({
        err: null
    }).status(200);
});

module.exports = router;