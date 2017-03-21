
window.onload = function() {
    paper.setup('myCanvas');
    with (paper) {
        var path = new Path();
        path.strokeColor = 'black';
        var start = new Point(100, 100);
        path.moveTo(start);
        path.lineTo(start.add([ 200, -50 ]));
        view.draw();
    }
}













// var socket;
//
// // Make the paper scope global, by injecting it into window:
// paper.install(window);
// window.onload = function() {
//
//     // Setup directly from canvas id:
//     paper.setup('myCanvas');
//     paper.createCanvas(400,400);
//     paper.background(0);
//
//     socket = io.connect('http://localhost:3000');
//
//     // We make a named event called 'mouse' and write an
//     // anonymous callback function
//     socket.on('mouse',
//         // When we receive data
//         function(data) {
//             console.log("Got: " + data.x + " " + data.y);
//             // Draw a blue circle
//             paper.fill(0,0,255);
//             paper.noStroke();
//             paper.ellipse(data.x, data.y, 20, 20);
//         }
//     );
//
//
//
//     // var path = new Path();
//     // path.strokeColor = 'black';
//     // var start = new Point(150, 100);
//     // path.moveTo(start);
//     // path.lineTo(start.add([ 200, -50 ]));
//     // view.draw();
// }
//
//
//
// function mouseDragged() {
//     // Draw some white circles
//     paper.fill(255);
//     paper.noStroke();
//     paper.ellipse(mouseX,mouseY,20,20);
//     // Send the mouse coordinates
//     sendmouse(mouseX,mouseY);
// }
//
// function sendmouse(xpos, ypos) {
//     // We are sending!
//     console.log("sendmouse: " + xpos + " " + ypos);
//
//     // Make a little object with  and y
//     var data = {
//         x: xpos,
//         y: ypos
//     };
//
//     // Send that object to the socket
//     socket.emit('mouse',data);
// }

