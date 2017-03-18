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

//TODO USE A DB (reddis)
//NAIVE SOLUTION!
var roomArr = [];
var roomHist = [];

io.on('connection', function (socket) {
  var addedUser = false;
  console.log("connected");
    io.clients(function(error, clients){
        if (error) throw error;
        console.log(clients);
    });
   // when the client emits 'add user', this listens and executes
  socket.on('addUser2Room', function (data) {
    if (addedUser) return;
    // we store the username in the socket session for this client and this room
    console.log(data.username, " is joining room ", data.roomname);
    socket.join(data.roomname);
    socket.username = data.username;
    socket.roomname = data.roomname;
    //user joins an existing room
    if(data.roomname in roomArr){
      roomArr[data.roomname] += 1;
      //supply new user with room history
      io.to(socket.id).emit('updateNewJoiner',roomHist[data.roomname]);

    }
    else{
      //init this room history
      roomHist[data.roomname] = [];
      roomArr[data.roomname] = 1;

    }
    console.log(roomArr);
      //console.log(roomArr[data.roomname]);

    //console.log(socket.rooms);

    //console.log(socket.roomname);
    //++numUsers;
    addedUser = true;

    io.in(data.roomname).emit('login', {
      numUsers: roomArr[socket.roomname]
    });

    // sending to all clients in room except sender
    socket.to(data.roomname).emit('user joined', {
      username: socket.username,
      numUsers: roomArr[socket.roomname]
    });

  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
      roomHist[socket.roomname].push({username: socket.username,message: data});
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
    console.log("disconnected");
    io.clients(function(error, clients){
        if (error) throw error;
        console.log("MEx: ", clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
    });
    if (addedUser) {
        if(--roomArr[socket.roomname] == 0){
          delete roomArr[socket.roomname];
          delete roomHist[socket.roomname];
        }
        console.log("Rooms left : " , roomArr);

        console.log(socket.username, " has left room ", socket.roomname);
      // echo globally that this client has left
      socket.leave(socket.roomname);
      //socket.leaveAll();
      socket.to(socket.roomname).emit('user left', {
        username: socket.username,
        numUsers: roomArr[socket.roomname]
      });
    }
  });
});