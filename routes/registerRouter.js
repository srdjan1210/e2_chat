const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        err: null
    }).status(200);
});


module.exports = router;