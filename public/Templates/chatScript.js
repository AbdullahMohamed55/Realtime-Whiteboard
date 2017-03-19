/*var socket = io.connect();

 socket.on('connect', function() {
 console.log('connected');
 });


 $(function() {

 $("#userSet").click(function() {setUser()});
 $("#submit").click(function() {sentMessage();});
 });
 socket.on('message', function(data) {

 addMessage(data['message'], data['user']);
 });
 function addMessage(msg, user) {
 $("#chatEntries").append('<div class="message"><p>' + user + ' : ' + msg + '</p></div>');
 }
 function sentMessage() {
 selector = $('#messageInput')
 if (selector.val() != "")
 {
 socket.emit('message',selector.val());
 addMessage(selector.val(), "Me", new Date().toISOString(), true);
 selector.val('');
 }
 }
 function setUser() {
 if ($("#userInput").val() != "")
 {
 socket.emit('setUser', $("#userInput").val());
 $('#chatControls').show();
 $('#userInput').hide();
 $('#userSet').hide();
 }
 }*/
// --------------------- testing code ------------------------
//TODO critical SCROLLING bug

var socket = io.connect();
var username;
var $messages = $('.messages-content'),
    d, h, m,
    i = 0;
socket.on('connect', function() {
    console.log("I am connected to server");
});
/*
socket.on('message', function(msg,usr) {

    insertMessage(msg,usr);
});*/

function sentMessage() {
    selector = $('#messageInput')
    if (selector.val() != "")
    {

        socket.emit('new message',selector.val(),username);
        //insertMessage(selector.val(),"Me");
        selector.val('');
    }
}
$(window).load(function() {
    //$messages.mCustomScrollbar();
    $('#submit').click(function() {
        sentMessage();
    });
    $('#usernameSubmit').click(function() {setUsername()});

});

///////////////////////
var clientData = {
    username : "",
    roomname : "space"
};
// Prevents input from having injected markup
function cleanInput (input) {
    return $('<div/>').text(input).text();
}

// Sets the client's username
function setUsername () {
    var username = cleanInput($("#userInput").val().trim());

    // If the username is valid
    if (username) {
        /*
        $loginPage.fadeOut();
        $chatPage.show();
        $loginPage.off('click');
        $currentInput = $inputMessage.focus();
        */
        clientData.username = username;
        // Tell the server your username
        //ON CONNECT
        /*
         socket.on('connect', function(){
         // call the server-side function 'adduser' and send one parameter (value of prompt)
         socket.emit('adduser', prompt("What's your name?"));
         });
         */
        socket.emit('addUser2Room', clientData);
    }
}

socket.on('updateNewJoiner',function(pastData){
    for(i in pastData){
        insertMessage(pastData[i].username, pastData[i].message);
        console.log(pastData[i]);
    }
});

// Whenever the server emits 'login', log the login message
socket.on('login', function (numUsers) {
    //connected = true;
    // Display the welcome message
    var message = "Welcome to" + clientData.roomname;//TODO USE TIME STAMP
    log(message);

    //addParticipantsNumbers(numUsers);
});

// Whenever the server emits 'new message', update the chat body
socket.on('new message', function (data) {
    console.log("new mess");
    insertMessage(data.username,data.message);
});

function addParticipantsNumbers(numUsers){
    //TODO SHOW num of ONLINE USERS
}

// Log a message
function log (message) {

    $("#messageContent").append('<div class="timestamp">' +  message  + '</div>');
}

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsNumbers(data.numUsers);
});

//TODO TYPING
// Whenever the server emits 'typing', show the typing message
socket.on('typing', function (data) {
    //addChatTyping(data);
});

// Whenever the server emits 'stop typing', kill the typing message
socket.on('stop typing', function (data) {
    //removeChatTyping(data);
});
/*
// Adds the visual chat typing message
function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
}

// Removes the visual chat typing message
function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
        $(this).remove();
    });
}
// Gets the 'X is typing' messages of a user
function getTypingMessages (data) {
return $('.typing.message').filter(function (i) {
return $(this).data('username') === data.username;
});
}

*/
//END TODO
// Gets the color of a username through our hash function
/*
//TODO Bonus
function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
}
*/
socket.on('disconnect', function () {
    log('you have been disconnected');
});

socket.on('reconnect', function () {
    log('you have been reconnected');
    if (username) {
        data.username = username;
        socket.emit('addUser2Room', data);
    }
});

socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
});

////////////////////////////
/*
function setUser() {

    if ($("#userInput").val() != "")
    {
        socket.emit('setUser', $("#userInput").val());
        username = $("#userInput").val()
    }
}*/
////////////////////
function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}

function setDate(){
    d = new Date()
    if (d.getMinutes()!=m) {
        m = d.getMinutes();
        $("#messageContent").append('<div class="timestamp">' + d.getHours() + ':' + m + '</div>');

    }
}

function insertMessage(user,msg) {
    setDate();
    if (clientData.username == user) {
        if ($.trim(msg) == '') {
            return false;
        }
        //$("#messageContent").append('<div class="timestamp">'+usr+'</div>');
        $("#messageContent").append('<div class="message message-personal">' + msg + '</div>');

        //updateScrollbar();
    }
    else{

        $("#messageContent").append('<div class="message new"><figure class="avatar"><img src="http://s3-us-west-2.amazonaws' +
            '.com/s.cdpn.io/156381/profile/profile-80_4.jpg"' + ' />' + '</figure>' + msg + '</div>');
        $('.message:last').append('<div class="userstamp">'+user+'</div>')
    }

    $('#messageInput').val(null);

}



$(window).on('keydown', function(e) {
    if (e.which == 13) {
        sentMessage();
        return false;
    }
})


function fakeMessage() {
    if ($('.message-input').val() != '') {
        return false;
    }
    $('<div class="message loading new"><figure class="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    //updateScrollbar();

    setTimeout(function() {
        $('.message.loading').remove();
        $('<div class="message new"><figure class="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg"' + ' />' +
            '</figure>' + "fuck You" + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        updateScrollbar();
        i++;
    }, 1000 + (Math.random() * 20) * 100);

}