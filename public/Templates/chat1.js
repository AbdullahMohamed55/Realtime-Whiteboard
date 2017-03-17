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

socket.on('connect', function() {
    console.log('connected');
});
socket.on('message', function(data) {

    insertMessage(data," ");
});


$(function() {
    $messages.mCustomScrollbar();
    $('#submit').click(function() {
        sentMessage();
    });
    $('#usernameSubmit').click(function() {setUser()});

});
function sentMessage() {
    selector = $('#messageInput')
    if (selector.val() != "")
    {

        socket.emit('message',selector.val());
        insertMessage(selector.val(),"Me");
        selector.val('');
    }
}
function setUser() {
    if ($("#userInput").val() != "")
    {
        socket.emit('setUser', $("#userInput").val());

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
    if (m != d.getMinutes()) {
        m = d.getMinutes();
        $("#messageContent").append('<div class="timestamp">' + d.getHours() + ':' + m + '</div>');
        //$('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
}

function insertMessage(msg,user) {

    if ($.trim(msg) == '') {
        return false;
    }
    $("#messageContent").append('<div class="message message-personal">' + msg + '</div>');
    setDate();
    $('#messageInput').val(null);
    updateScrollbar();

}



$(window).on('keydown', function(e) {
    if (e.which == 13) {
        insertMessage();
        return false;
    }
})


/*function fakeMessage() {
    if ($('.message-input').val() != '') {
        return false;
    }
    $('<div class="message loading new"><figure class="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();

    setTimeout(function() {
        $('.message.loading').remove();
        $('<div class="message new"><figure class="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg"' + ' />' +
            '</figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        updateScrollbar();
        i++;
    }, 1000 + (Math.random() * 20) * 100);

}*/