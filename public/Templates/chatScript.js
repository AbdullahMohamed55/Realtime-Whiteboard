/**
 * Created by abdullah on 3/17/17.
 */
var socket = io.connect();

socket.on('connect', function() {
    console.log('connected');
});


$(function() {
    $("#chatControls").hide();
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
}
