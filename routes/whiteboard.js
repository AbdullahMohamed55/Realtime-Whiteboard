var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('express-session');


/* GET home page. */
router.get('/', function(req, res, next) {
    //console.log(path.join(__dirname, '../views'));
    sess = req.session;


    res.render('whiteboard', {userInfo: sess.username} );


    // res.render('room', {room: rm, userName: cookie,users:users,points:points});
});

module.exports = router;




