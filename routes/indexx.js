/**
 * Created by zidan on 3/17/17.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('/home/zidan/RealtimeWhiteboard/views/indexx.html');
});

module.exports = router;
