var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('/home/zidan/RealtimeWhiteboard/views/whiteboard.html');

});

module.exports = router;




