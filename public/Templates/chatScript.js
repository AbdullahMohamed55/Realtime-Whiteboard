var typing = false;
var userTyping = false;
var toggle = false;
var TYPING_TIMER_LENGTH = 400; // ms
var socket = io.connect();
var nousers = 1;
var username;
var unseenmsg = 0;
var $messages = $('.messages-content'),
    d, h, m;
var clientData = {
    username: "",
    roomname: "Draw It",
    url: ""
};
var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00',
    '#3b88eb', '#3824aa',
    '#FF33D4', '#9633FF', '#F9FF33', '#17202A'
];


socket.on('connect', function () {
    console.log("I am connected to server");
});

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

socket.on('updateNewJoiner', function (pastData) {
    for (i in pastData) {
        insertMessage(pastData[i].username, pastData[i].message, pastData[i].id);
        console.log(pastData[i]);
    }
});

socket.on('Token not found', function () {
    swal("Token NOT Exist !", "New room was created")

});

socket.on('login', function (data) {

    console.log("URL " + data.url);

    clientData.url = data.url;
    nousers = data.numUsers;
    $('#numusers').text('online users :' + nousers);
    //log(message);

});

socket.on('new message', function (data) {
    console.log("new mess");

    insertMessage(data.username, data.message, data.id);
});

socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsNumbers(data.numUsers);
});

socket.on('typing', function (data) {
    if (!userTyping) {
        addChatTyping(data.username);
        userTyping = true;
    }
});

socket.on('stop typing', function (data) {
    removeChatTyping();
    userTyping = false;
});


// minmizing chat box by making decreasing its height
$('#minmizeChat').click(function () {
    if (toggle) {
        $('#chatbox').css("height", "7vh");
        $('#chattext').css("display", "none");
        toggle = false;
        if (unseenmsg != 0) {
            $('#countermsg').text(unseenmsg);
            $('#countermsg').css("display", 'inline');
        }
    }
    else {
        $('#countermsg').css("display", 'none');
        unseenmsg = 0;
        $('#chatbox').css("height", "80vh");
        $('#chattext').css("display", "inline");
        toggle = true;
    }
});

// welcoming the user and ask them to enter a username and enter a room
$(window).load(function () {

    swal({
            title: "Welcome to DrawIt",
            type: "input",
            text: "Please enter your nickname in the room",
            showCancelButton: false,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Write in your username",
            closeOnCancel: false
        },
        function (inputValue) {
            if (inputValue === false) return false;

            if (inputValue === "") {
                swal.showInputError("You need to write something!");
                return false
            }
            if (inputValue.length > 15 || inputValue.length < 3) {
                swal.showInputError("Enter an username between 3 and 15 character");
                return false
            }
            username = cleanInput(inputValue.trim());

            setUsername();
            swal("Nice!", "Welcome " + inputValue, "success");

            addtoroom();
        });

    $('#submit').click(function () {
        sentMessage();
    });
    $('#usernameSubmit').click(function () {
        addtoroom();
    });
    $messages.mCustomScrollbar();

});

$('#share').click(function () {

    swal("Token generated !", clientData.url, "success");

});
///////////////////////

// Prevents input from having injected markup
function cleanInput(input) {
    return $('<div/>').text(input).text();
}

//hashing every user's color
function getUsernameColor(id) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
}

// adding someone to a new room or an existing one by entering a token of it.
function addtoroom() {

    if (username) {

        swal({
                title: "Enter Url",
                type: "warning",

                text: "To enter url press ok or create a new room",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                cancelButtonText: "No, create new room",
                closeOnConfirm: false,
                closeOnCancel: false
            },

            function (isConfirm) {
                if (isConfirm) {
                    swal({
                            title: "Room URL",
                            type: "input",
                            showCancelButton: false,
                            closeOnConfirm: false,
                            animation: "slide-from-top",
                            inputPlaceholder: "Write in your URl",
                            closeOnCancel: false
                        },
                        function (inputValue) {
                            if (inputValue === false) return false;

                            if (inputValue === "") {
                                swal.showInputError("You need to write something!");
                                return false
                            }
                            if (inputValue.length > 49) {
                                swal.showInputError("the token is too long");
                                return false
                            }
                            clientData.url = inputValue;
                            console.log(inputValue);
                            socket.emit('addUser2Room', clientData);
                            swal("Welcome", "Join Your friends", "success");

                        });


                } else {
                    swal("Done", "New room was created", "success");
                    socket.emit('addUser2Room', clientData);

                }

            });


    }
}

// sending a message to server
function sentMessage() {
    selector = $('#messageInput')
    if (selector.val() != "") {

        socket.emit('new message', selector.val(), username);
        //insertMessage(selector.val(),"Me");
        selector.val('');
    }
}

// update username and the users number in the room
function setUsername() {

    // If the username is valid
    if (username) {

        clientData.username = username;
        $('<div style="text-decoration: none">' + username + '</div>').appendTo($('.chat-title')).addClass('new');
        $('<div class="timestamp" id="numusers" style="margin: 0px">online users :' + nousers + '</div>').appendTo($('.chat-title')).addClass('new');
        $('#myColor').css('background-color', getUsernameColor(socket.id));


    }
}

// notification message when a new user enters the room
function log(message) {
    $('<div class="timestamp">' + message + '</div>').appendTo($('.mCSB_container')).addClass('new');
    //$("#messageContent").append('<div class="timestamp">' +  message  + '</div>');
    updateScrollbar();
}


// update the scroll in chat box
function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}

$('#messageInput').on('input', function () {
    updateTyping();
});


//add time to message when two message not in the same minute
function setDate() {
    d = new Date()
    if (d.getMinutes() != m) {
        m = d.getMinutes();
        $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.mCSB_container')).addClass('new');
        //$("#messageContent").append('<div class="timestamp">' + d.getHours() + ':' + m + '</div>');

    }
    updateScrollbar();
}

// insert the message in the chat box
function insertMessage(user, msg, id) {
    setDate();
    //security concerns
    if (socket.id == id) {
        if ($.trim(msg) == '') {
            return false;
        }


        $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');

    }
    else {
        // if message is not seen yet
        if (!toggle) {
            unseenmsg += 1;
            $('#countermsg').text(unseenmsg);
            $('#countermsg').css("display", 'inline');
        }
        $('<div class="message new"><figure class="avatar" style="background-color:' + getUsernameColor(id) + '"></figure>'
            + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
        $('.message:last').append('<div class="userstamp">' + user + '</div>')
    }

    $('#messageInput').val(null);
    updateScrollbar();

}


$(window).on('keydown', function (e) {
    if (e.which == 13) {
        sentMessage();
        return false;
    }
})

// add someone is typing in chatbox
function addChatTyping(user) {
    $('<div class="message loading"><figure class="avatar" style="background-color:grey"></figure></div>').appendTo($('.mCSB_container')).addClass('new');
    $('.message:last').append('<div>someone is typing...' + '</div>');
    updateScrollbar();
}

// remove someone is typing from html
function removeChatTyping() {
    $('.message.loading').remove();
}

// update typing interval and emit it to the server
function updateTyping() {

    if (!typing) {
        typing = true;
        socket.emit('typing');
    }
    lastTypingTime = (new Date()).getTime();

    setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
            socket.emit('stop typing');
            typing = false;
        }
    }, TYPING_TIMER_LENGTH);
}

