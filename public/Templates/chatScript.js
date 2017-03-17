/**
 * Created by abdullah on 3/17/17.
 */
var socket = io.connect();
socket.on('connect', function() {
    console.log('connected');
});
socket.on('nbUsers', function(msg) {
    $("#nbUsers").html(msg.nb);
});

$(function() {
    $("#chatControls").hide();
    $("#pseudoSet").click(function() {setPseudo()});
    $("#submit").click(function() {sentMessage();});
});
socket.on('message', function(data) {
    addMessage(data['message'], data['pseudo']);
});
function addMessage(msg, pseudo) {
    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
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
function setPseudo() {
    if ($("#pseudoInput").val() != "")
    {
        socket.emit('setPseudo', $("#pseudoInput").val());
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
}
