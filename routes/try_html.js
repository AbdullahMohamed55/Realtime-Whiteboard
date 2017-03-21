var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('/home/adeladham/JS/Wboared-Jade/views/try.html');
});

module.exports = router;




