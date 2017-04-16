var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('/home/abdullah/Desktop/WhiteBoard/views/whiteboard.html');

});

module.exports = router;




