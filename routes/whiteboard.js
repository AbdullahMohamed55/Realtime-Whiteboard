var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('express-session');


/* GET home page. */
router.get('/', function(req, res, next) {
    //console.log(path.join(__dirname, '../views'));
    sess = req.session;



    if (!sess.username)
    {
        res.render('whiteboard', {userInfo: sess.username, saved: new Array()} );
    }
    else
    {
        var fs = require("fs");

        var p = path.join(__dirname,'..','users',sess.username);
        if (!fs.existsSync(p)){
            res.render('whiteboard', {userInfo: sess.username, saved: new Array()} );
        }
        fs.readdir(p, function (err, files) {
            if (err) {
                throw err;
            }
            var saved=new Array();
            files.map(function (file) {
                return path.join(p, file);
            }).filter(function (file) {
                return fs.statSync(file).isFile();
            }).forEach(function (file) {
                saved.push(path.basename(file));
            });
            res.render('whiteboard', {userInfo: sess.username, saved: saved} );
        });

    }

});




module.exports = router;




