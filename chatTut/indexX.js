// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom
var numUsers = 0;
//var chatroom;
var roomArr = [];

io.on('connection', function (socket) {
  var addedUser = false;
  //var chatroom;
  
   // when the client emits 'add user', this listens and executes
  socket.on('addUser2Room', function (data) {
    if (addedUser) return;

    //var chatroom = io.of('/' + data.roomname); //Initializes and retrieves the given Namespace by its pathname identifier nsp

    // we store the username in the socket session for this client and this room
    console.log(data.username, " is joining room ", data.roomname);
    socket.join(data.roomname);
    /*if(data.roomname in roomArr){
      roomArr[data.roomname]
    }*/
    io.clients(function(error, clients){
          if (error) throw error;
          console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
    });
    console.log(socket.rooms);
    socket.username = data.username;
    socket.roomname = data.roomname;
    //console.log(socket.roomname);
    ++numUsers;
    addedUser = true;

    io.in(data.roomname).emit('login', {
      numUsers: numUsers
    });

    // sending to all clients in room except sender
    socket.to(data.roomname).emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });


  });


  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.to(socket.roomname).emit('new message', {
      username: socket.username,
      message: data
    });
  });

 

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.to(socket.roomname).emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.to(socket.roomname).emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.to(socket.roomname).emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});