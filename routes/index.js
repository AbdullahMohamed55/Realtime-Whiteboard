var express = require('express');
var paper = require('paper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;




