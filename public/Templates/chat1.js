/**
 * Created by abdullah on 3/17/17.
 */
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
var socket = io.connect();
var username;
var $messages = $('.messages-content'),
    d, h, m,
    i = 0;
socket.on('connect', function() {

});
socket.on('message', function(msg,usr) {

    insertMessage(msg,usr);
});

function sentMessage() {
    selector = $('#messageInput')
    if (selector.val() != "")
    {

        socket.emit('message',selector.val(),username);
        //insertMessage(selector.val(),"Me");
        selector.val('');
    }
}
$(window).load(function() {
    //$messages.mCustomScrollbar();
    $('#submit').click(function() {
        sentMessage();
    });
    $('#usernameSubmit').click(function() {setUser()});

});

function setUser() {

    if ($("#userInput").val() != "")
    {
        socket.emit('setUser', $("#userInput").val());
        username = $("#userInput").val()
    }
}
function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}

function setDate(){
    d = new Date()
    if (true) {
        m = d.getMinutes();
        $('.messages').append('<div class="message timestamp">' + d.getHours() + ':' + m + '</div>');

    }
}

function insertMessage(msg,user) {
    //setDate();
    if (username == user) {
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
        insertMessage();
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