//Drawing with 2 different methods
paper.install(window);
// Keep global references to both tools, so the HTML
// links below can access them.
var tool1, tool2;

window.onload = function() {
    paper.setup('myCanvas');

    // Create two drawing tools.
    // tool1 will draw straight lines,
    // tool2 will draw clouds.

    // Both share the mouseDown event:
    var path;
    function onMouseDown(event) {
        path = new Path();
        path.strokeColor = 'black';
        path.add(event.point);
    }

    tool1 = new Tool();
    tool1.onMouseDown = onMouseDown;

    tool1.onMouseDrag = function(event) {
        path.add(event.point);
    }

    tool2 = new Tool();
    tool2.minDistance = 20;
    tool2.onMouseDown = onMouseDown;

    tool2.onMouseDrag = function(event) {
        // Use the arcTo command to draw cloudy lines
        path.arcTo(event.point);
    }
}

//trying socket and collaborative drawing
// (1): Send a ping event with
// some data to the server
// io = io.connect('http://localhost:3000');
//
// console.log( "socket: browser says ping (1)" )
// io.emit('ping', { some: 'data' } );
//
// // (4): When the browser receives a pong event
// // console log a message and the events data
// io.on('pong', function (data) {
//     console.log( 'socket: browser receives pong (4)', data );
// });
//
//
//
// paper.install(window);
//
// window.onload = function() {
//
//     paper.setup('myCanvas');
//
//     // tool.maxDistance = 50;
// // Returns an object specifying a semi-random color
// // The color will always have a red value of 0
// // and will be semi-transparent (the alpha value)
//     function randomColor() {
//
//         return {
//             red: 0,
//             green: Math.random(),
//             blue: Math.random(),
//             alpha: ( Math.random() * 0.25 ) + 0.05
//         };
//     }
//
// // every time the user drags their mouse
// // this function will be executed
//     function onMouseDrag(event) {
//         // Take the click/touch position as the centre of our circle
//         var x = event.middlePoint.x;
//         var y = event.middlePoint.y;
//         // The faster the movement, the bigger the circle
//         var radius = event.delta.length / 2;
//         // Generate our random color
//         var color = randomColor();
//         // Draw the circle
//         drawCircle(x, y, radius, color);
//         // Pass the data for this circle
//         // to a special function for later
//         emitCircle(x, y, radius, color);
//     }
//
//     function drawCircle(x, y, radius, color) {
//         // Render the circle with Paper.js
//         var circle = new Path.Circle(new Point(x, y), radius);
//         circle.fillColor = new RgbColor(color.red, color.green, color.blue, color.alpha);
//         // Refresh the view, so we always get an update, even if the tab is not in focus
//         view.draw();
//     }
//
//     // This function sends the data for a circle to the server
// // so that the server can broadcast it to every other user
//     function emitCircle( x, y, radius, color ) {
//
//         // Each Socket.IO connection has a unique session id
//         var sessionId = io.socket.sessionid;
//
//         // An object to describe the circle's draw data
//         var data = {
//             x: x,
//             y: y,
//             radius: radius,
//             color: color
//         };
//
//         // send a 'drawCircle' event with data and sessionId to the server
//         io.emit( 'drawCircle', data, sessionId )
//
//         // Lets have a look at the data we're sending
//         console.log( data )
//
//     }
//
//     // Listen for 'drawCircle' events
// // created by other users
//     io.on( 'drawCircle', function( data ) {
//         console.log( 'drawCircle event recieved:', data );
//
//         // Draw the circle using the data sent
//         // from another user
//         drawCircle( data.x, data.y, data.radius, data.color );
//
//
//     });
//
//
// }
//


//recognizing mouse actions(drawing)
// paper.install(window);
// window.onload = function() {
//     paper.setup('myCanvas');
//     // Create a simple drawing tool:
//     var tool = new Tool();
//     var path;
//
//     // Define a mousedown and mousedrag handler
//     tool.onMouseDown = function(event) {
//         path = new Path();
//         path.strokeColor = 'black';
//         path.size = '100'
//         path.add(event.point);
//     }
//
//     tool.onMouseDrag = function(event) {
//         path.add(event.point);
//     }
// }


//moving rect
// paper.install(window);
// window.onload = function() {
//     paper.setup('myCanvas');
//     var path = new Path.Rectangle([75, 75], [150, 150]);
//     path.strokeColor = 'black';
//
//     view.onFrame = function(event) {
//         // On each frame, rotate the path by 3 degrees:
//         path.rotate(3);
//     }
// }


//Draw line
// window.onload = function() {
//     paper.setup('myCanvas');
//     with (paper) {
//         var path = new Path();
//         path.strokeColor = 'black';
//         var start = new Point(100, 100);
//         path.moveTo(start);
//         path.lineTo(start.add([ 200, -50 ]));
//         view.draw();
//     }
// }


//Trying some shit
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

