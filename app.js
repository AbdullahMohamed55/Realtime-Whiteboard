var express = require('express');
var paper = require('paper');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

var users = require('./routes/users');
var whiteboard = require('./routes/whiteboard');

var app = require('express')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/', whiteboard);

// var aUser = "";
//connect to database
var connection = mysql.createConnection({

    host: 'us-cdbr-iron-east-03.cleardb.net',
    user: 'bbf17e20c980d8',
    password: 'b6abe9ee',
    database: 'heroku_96c18a2afd659e5'
});

connection.connect(function (error) {
        if (error)
            console.log("Can`t connect to database");
        else
            console.log("connected to database");
    }
);

function fetchUsers(handle, password, callback) {
    var query = connection.query('SELECT * FROM  users WHERE username = ' + connection.escape(handle), function (err, result) {
        if(result.length != 0) {
            // console.log(result[0]['username']);
            // console.log(result[0].password);
        }
        callback(result.length != 0 && result[0].username == handle && result[0]['password'] == password);
    });
}

var sess;
app.post('/login', function (req, res) {

    sess = req.session;

    var out = {'handle': '', 'password': '', 'status': 'OK'};

    var handle = (JSON.parse(JSON.stringify(req.body)).handle).trim();
    var password = (JSON.parse(JSON.stringify(req.body)).password).trim();

    fetchUsers(handle,password, function (ans) {
        if(ans){
            console.log("True value");
            out['status'] = 'success';
            sess.username = handle;
            app.locals.authUser = handle;
            console.log(sess.username);
        }
        else{
            out['status'] = 'failed';
            out['handle'] = 'Wrong username/password';
        }
        res.send(out);
    });
});

function compareUsers(handle, callback) {
    var query = connection.query('SELECT * FROM  users WHERE username = ' + connection.escape(handle), function (err, result) {
        callback(result.length == 0);
    });
}
app.post('/signup', function (req, res) {

    var out = {'handle': '', 'password': '', 'status': 'OK'};

    var handle = (JSON.parse(JSON.stringify(req.body)).handle).trim();
    var password = (JSON.parse(JSON.stringify(req.body)).password).trim();
    var passVal = (JSON.parse(JSON.stringify(req.body)).passVal).trim();

    // console.log(passVal);
    compareUsers(handle, function (ans) {
        console.log("function result: " + ans);

        if (ans)
            out['status'] = 'success';
        else {
            out['status'] = 'failed';
            out['handle'] = 'this username is taken';
        }

        if (password != passVal) {
            out['password'] = 'passwords don`t match';
            out['status'] = 'failed';
            console.log("asswords don`t m");
        }

        console.log(out['status'] + "+++" + out.status);

        if (out.status == 'success') {

            console.log("success2");

            var user = {
                username: handle,
                password: password
            };

            var query2 = connection.query('insert into users set ?', user, function (err, result) {
            });

            out['status'] = 'success';
            console.log("success3");
        }
        res.send(out);
    });
});


app.post('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.send("Logged out");
        }
    });

});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// console.log("aUser: " + aUser);
module.exports = app;

// module.exports.authUser = aUser;