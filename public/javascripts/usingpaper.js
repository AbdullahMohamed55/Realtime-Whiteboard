//Drawing with 2 different methods
// paper.install(window);
// // Keep global references to both tools, so the HTML
// // links below can access them.
//
// var socket;
// socket = io.connect('http://localhost:3000');
//
// var tool1, tool2;
// window.onload = function() {
//     paper.setup('myCanvas');
//
//
//
//     //receiving any sent data from server
//     socket.on('mouse',
//         // When we receive data
//         function(data) {
//             console.log("Got: " + data);
//             // Draw a blue circle
//
//             var path = new Path();
//
//             //why the fuck it is not drawing?!!
//             path.strokeColor = 'black';
//             path.add(data);
//             view.draw();
//             tool1.activate();
//
//
//         }
//     );
//     // Create two drawing tools.
//     // tool1 will draw straight lines,
//     // tool2 will draw clouds.
//     var path;
//     // Both share the mouseDown event:
//     function onMouseDown(event) {
//         path = new Path();
//         path.strokeColor = 'black';
//         path.add(event.point);
//
//
//
//     }
//
//     tool1 = new Tool();
//     tool1.onMouseDown = onMouseDown;
//
//     tool1.onMouseDrag = function(event) {
//         path.add(event.point);
//
//         //sending this to server
//         var data = event.point;
//         socket.emit('mouse', data)
//
//
//     }
//
//     tool2 = new Tool();
//     tool2.minDistance = 20;
//     tool2.onMouseDown = onMouseDown;
//
//     tool2.onMouseDrag = function(event) {
//         // Use the arcTo command to draw cloudy lines
//         path.arcTo(event.point);
//
//         //sending this to server
//         var data = event.point;
//         console.log("Iam " + io.socket.id + "sendmouse: " + data);
//         socket.emit('mouse', data)
//
//     }
//
//
// }


// var socket;
// socket = io.connect('http://localhost:3000');
//trying socket and collaborative drawing
// (1): Send a ping event with
// some data to the server
// console.log( "socket: browser says ping (1)" )
// socket.emit('ping', { some: 'data' } );
// (4): When the browser receives a pong event
// console log a message and the events data
// socket.on('pong', function (data) {
// console.log( 'socket: browser receives pong (4)', data );
// });


paper.install(window);
var socket;
socket = io.connect('http://localhost:3000');

// console.log("I am a new client");

// document.getElementById("note").onclick(function () {
//
//     document.getElementById("myCanvas").style.backgroundImage = "url('../images/note.jpg')";
//
// });

window.onload = function () {
    paper.setup('myCanvas');


    //===============================================Handling background change
    //the default background
    document.getElementById("myCanvas").style.backgroundImage = "url('../images/whiteboard/blank.jpg')";

    //the received background
    socket.on('changeBackground', function (data) {
        console.log('Background: ', data);

        document.getElementById("myCanvas").style.backgroundImage = "  url('../images/whiteboard/" + data + " ') ";
    });

    //jQuery==========Change background and forward it to socket
    $("#note").click(function () {

        document.getElementById("myCanvas").style.backgroundImage = "url('../images/whiteboard/note.jpg')";

        var data = "note.jpg"
        socket.emit('changeBackground', data);
    });

    $("#squared").click(function () {
        document.getElementById("myCanvas").style.backgroundImage = "url('../images/whiteboard/squared.png')";

        var data = "squared.png"
        socket.emit('changeBackground', data);
    });

    $("#blank").click(function () {
        document.getElementById("myCanvas").style.backgroundImage = "url('../images/whiteboard/blank.jpg')";

        var data = "blank.jpg";
        socket.emit('changeBackground', data);
    });


//===============================================Handling Circles OR Brush

    $("#circle").click(function () {
        tool2.activate();
    });

    $("#brush").click(function () {
        tool1.activate();
        Dcolor = "black";
    });


    //my initialization for brush type
    var Dcolor = "";
    var Dsize = 2;
    var paths2 = new Array();
    var paths3 = new Array();
    //-----------------Brush--------------------
    var tool1 = new Tool();
    tool1.minDistance = 10;

    var path2; //myPath
    var path3; //myReceivedPath
    tool1.onMouseDown = function onMouseDown(event) {
        // Create a new path and select it:
        path2 = new Path();
        //===============================================Handling brush color change
        $("#black").click(function () {
            Dcolor = "black";
        });

        $("#red").click(function () {
            Dcolor = "red";
        });

        $("#green").click(function () {
            Dcolor = "green";
        });

        $("#blue").click(function () {
            Dcolor = "blue";
        });

        $("#yellow").click(function () {
            Dcolor = "yellow";
        });

        path2.strokeColor = Dcolor;

        //===============================================Handling brush size change
        $("#xsmall").click(function () {
            Dsize = 2;
        });

        $("#small").click(function () {
            Dsize = 4;
        });

        $("#medium").click(function () {
            Dsize = 8;
        });

        $("#large").click(function () {
            Dsize = 12;
        });

        $("#xlarge").click(function () {
            Dsize = 25;
        });

        path2.strokeWidth = Dsize;

        // Add a segment to the path where you clicked
        path2.add(event.point);
        // console.log("My Path down: " + path2.id);

        var data = {
            pnt: event.point,
            Dcolor: Dcolor,
            Dsize: Dsize
        };

        socket.emit('brush1', data);
    };

    tool1.onMouseDrag = function onMouseDrag(event) {

        path2.add(event.point);

        console.log("Drawing : " + event.point.x);

        // console.log("My Path drag: " + path2.id);


        socket.emit('brush2', event.point);
    };

    tool1.onMouseUp = function (event) {

        paths2.push(path2);
        socket.emit('mouse_up', "UP");
    };

    socket.on('mouse_up',
        // When we receive data
        function (data) {
            paths3.push(path3);
        }
    );

    socket.on('undo',
        // When we receive data
        function (data) {

            console.log("Undo Request: " + data);

            if (paths3.length >0){
                paths3[paths3.length - 1].remove();
                paths3.pop();

            }
            // view.draw();
            console.log("Path to be deleted: " + path3.id);
        }
    );


    $("#undo").click(function () {
        // canvas.parentNode.removeChild(path2);
        if (paths2.length >0){
            paths2[paths2.length - 1].remove();
            paths2.pop();

        }
        socket.emit('undo', "undo");
    });


        //receiving any sent data from server
    socket.on('brush1',
        // When we receive data
        function (data) {

            console.log("Received1: " + data.pnt[1] + " " + data.pnt[2]);

            path3 = new Path();
            path3.strokeColor = data.Dcolor;
            path3.strokeWidth = data.Dsize;
            path3.add(new Point(data.pnt[1], data.pnt[2]));

            view.draw();
            console.log("brush1 Path: " + path3.id);

        }
    );

    socket.on('brush2',
        // When we receive data
        function (data) {

            console.log("Received2: " + data);

            //This is too fuckin stupid shit of java
            path3.add(new Point(data[1], data[2]));
            view.draw();

            console.log("brush2 Path: " + path3.id);
        }
    );


    $("#snapshot").click(function () {
        // these two lines create an Image Object and load it with what/s on the canvas
        var thisImage = new Image();
        thisImage = document.getElementById('myCanvas').toDataURL();

        downloadURI(thisImage,"image.png");

        // localStorage.setItem("imgData", thisImage);

        // var win=window.open();
        // win.document.write("<img src='"+thisImage+"'/>");
    });

    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }





    //---------------Circles------------------
    var tool2 = new Tool();
    tool2.maxDistance = 100;

    function randomColor() {

        return {
            red: Math.random(),
            green: Math.random(),
            blue: Math.random(),
            alpha: ( Math.random() * 0.4 ) + 0.07
        };
    }

    function drawCircle(x, y, radius, color) {
        // Render the circle with Paper.js
        var circle = new Path.Circle(new Point(x, y), radius);
        circle.fillColor = new Color(color.red, color.green, color.blue, color.alpha);
        // Refresh the view, so we always get an update, even if the tab is not in focus
        view.draw();
    }

    function emitCircle(x, y, radius, color) {

        // An object to describe the circle's draw data
        var data = {
            x: x,
            y: y,
            radius: radius,
            color: color
        };

        // send a 'drawCircle' event with data and sessionId to the server
        socket.emit('drawCircle', data);

        // Lets have a look at the data we're sending
        console.log("sent data: " + data);

    }


    tool2.onMouseDrag = function onMouseDrag(event) {
        // Take the click/touch position as the centre of our circle
        var x = event.middlePoint.x;
        var y = event.middlePoint.y;

        console.log("y: " + event.middlePoint.y);

        // The faster the movement, the bigger the circle
        var radius = event.delta.length / 2;
        // Generate our random color
        var color = randomColor();

        // Draw the circle
        drawCircle(x, y, radius, color);
        // Pass the data for this circle
        // to a special function for later
        emitCircle(x, y, radius, color);
    };

    socket.on('drawCircle', function (data) {
        console.log('drawCircle event recieved:', data);
        // Draw the circle using the data sent
        // from another user
        drawCircle(data.x, data.y, data.radius, data.color);
    });

};

//======================================================================================================================

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

