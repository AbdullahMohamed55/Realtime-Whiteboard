var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});
io.emit('some event', { for: 'everyone' });
io.on('connection', function(socket){
    console.log('I knew that you\'re on');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

});


http.listen(3000, function(){
    console.log('hey we are spying on 3000');
});