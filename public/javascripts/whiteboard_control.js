paper.install(window);
var socket;
// socket = io.connect('http://localhost:3000');
socket = io();

window.onload = function () {
    var Mycanvas = document.getElementById('myCanvas');
    paper.setup('myCanvas');
    console.log("Canvas loadred");


    //===============================================Handling background change
    //the default background
    Mycanvas.style.backgroundImage = "url('../images/whiteboard/dark.jpg')";

    //the received background
    socket.on('changeBackground', function (data) {
        console.log('Background: ', data);

        Mycanvas.style.backgroundImage = "  url('../images/whiteboard/" + data + " ') ";
    });

    //jQuery==========Change background and forward it to socket
    $("#dark").click(function () {

        Mycanvas.style.backgroundImage = "url('../images/whiteboard/dark.jpg')";

        var data = "dark.jpg";
        socket.emit('changeBackground', data);
    });

    $("#squared").click(function () {
        Mycanvas.style.backgroundImage = "url('../images/whiteboard/squared.png')";

        var data = "squared.png"
        socket.emit('changeBackground', data);
    });

    $("#blank").click(function () {
        Mycanvas.style.backgroundImage = "url('../images/whiteboard/blank.jpg')";

        var data = "blank.jpg";
        socket.emit('changeBackground', data);
    });


//==============================my initialization for brush
    var Dcolor = "black";
    var Dsize = 2;
    var paths2Holder = new Array(); //holds my paths
    var paths3Holder = []; //holds my received paths
    // var Clearpath = new Array();
    var pathPoints; //holds every path`s data
    var savePaths = new  Array(); //container of all path points
    var clearedScreen = false;
    // console.log(Clearpath.length);
    //-----------------Brush--------------------
    var tool1 = new Tool();
    tool1.minDistance = 10;

    var path2; //myPath
    var path3; //myReceivedPath

//===============================================Handling brush color_change
    $("#black").click(function () {
        Dcolor = "black";
    });

    $("#white").click(function () {
        Dcolor = "white";
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


    tool1.onMouseDown = function onMouseDown(event) {
        // Create a new path and select it:
        path2 = new Path();
        path2.strokeColor = Dcolor;
        path2.strokeWidth = Dsize;
        // Add a segment to the path where you clicked
        path2.add(event.point);
        // console.log("My Path down: " + path2.id);

        var data = {
            pnt: event.point,
            Dcolor: Dcolor,
            Dsize: Dsize
        };

        pathPoints = new Array();

        pathPoints.push(data);

        socket.emit('brush1', data);
    };

    tool1.onMouseDrag = function onMouseDrag(event) {

        path2.add(event.point);

        console.log("Drawing : " + event.point.x);
        // console.log("Event : " + event);

        // console.log("My Path drag: " + path2.id);
        var data = {
            pnt: event.point,
            Dcolor: Dcolor,
            Dsize: Dsize
        };

        pathPoints.push(data);

        socket.emit('brush2', event.point);
    };
//bckgnd
socket.on('updateNewJoinerDrawBckgnd',
    function(bckgnd){
        Mycanvas.style.backgroundImage = "  url('../images/whiteboard/" + bckgnd + " ') ";
    
});
//draw history
socket.on('updateNewJoinerDraw', function(data){

    console.log("Updtae data: " + data);


    //do I need a container here to look if drawHist is emtpy I will clear it ?!!
if(typeof data != 'undefined' || data != null ) {
    // console.log("Received History: " + data[0][0].Dcolor + " " + data[0][0].Dsize + data[0][0].pnt);

    //data -> key[room]=>value[ path1 | path2 | .... ]
    // for (var k = 0; k < data.length; k++) {
    //     for (var i = 0; i < data[k].length; i++) {
    //
    //         var histPath = new Path();
    //         histPath.strokeColor = data[k][i][0].Dcolor;
    //         histPath.strokeWidth = data[k][i][0].Dsize;
    //
    //         for (var j = 0; j < data[k][i].length; j++) {
    //
    //             histPath.add(new Point(data[k][i][j].pnt[1], data[k][i][j].pnt[2]));
    //
    //         }
    //     }
    // }

    //edited
    for (var i = 0; i < data.length; i++) {

        var client = data[i][0];
        var currentData = data[i][1];

        console.log("client: " + client);
        console.log("currentData: " +currentData);

        var histPath = new Path();
        histPath.strokeColor = currentData[0].Dcolor;
        histPath.strokeWidth = currentData[0].Dsize;

        for (var j = 0; j < currentData.length; j++) {

            histPath.add(new Point(currentData[j].pnt[1], currentData[j].pnt[2]));
        }

        if(!paths3Holder[client]) {
            paths3Holder[client] = new Array();
        }
        paths3Holder[client].push(histPath);

    }



}
});

//=======================receiving any sent data from server
socket.on('brush1',
    // When we receive data
    function (data) {

        console.log("Received1: " + data.pnt[1] + " " + data.pnt[2]);

        path3 = new Path();
        path3.strokeColor = data.Dcolor;
        path3.strokeWidth = data.Dsize;
        path3.add(new Point(data.pnt[1], data.pnt[2]));

        view.draw();
        //console.log("brush1 Path: " + path3.id);

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

//=============================Saving My paths and Handling undo
    tool1.onMouseUp = function (event) {

        paths2Holder.push(path2);
        // savePaths.push(pathPoints); //will form drawHist
        console.log(pathPoints);

        socket.emit('mouse_up', pathPoints); //modified
    };

    socket.on('mouse_up',
        // When we receive data
        function (data) {
            if(typeof paths3Holder[data] == 'undefined'){
                paths3Holder[data] = [];
            }
            paths3Holder[data].push(path3);
            console.log(data);
            console.log(paths3Holder);
            console.log(paths3Holder[data]);
            console.log(path3);

        }
    );

    //Only undo my work
    $("#undo").click(function () {
        // canvas.parentNode.removeChild(path2);
        // console.log("Entered undo");
        // console.log("paths2Holder Size: " + paths2Holder.length );
        // console.log("Clear size: " + Clearpath.length);
        // if (clearedScreen){
        //
        //     // console.log(savePaths);
        //
        //     for(var i = 0;i<savePaths.length;i++){
        //
        //         var newPath = new Path();
        //         newPath.strokeColor = savePaths[i][0].Dcolor;
        //         newPath.strokeWidth = savePaths[i][1].Dsize;
        //
        //         for(var j = 0;j<savePaths[i].length;j++) {
        //
        //             newPath.add(savePaths[i][j].pnt);
        //             console.log(savePaths[i][j]);
        //
        //         }
        //     }
        //     clearedScreen = false;
        //
        //
        //     console.log("Entered clear");
        //
        // }

        if (paths2Holder.length >0){
            paths2Holder[paths2Holder.length - 1].remove();
            paths2Holder.pop();
        }
        socket.emit('undo');
    });

    socket.on('undo',
        // When we receive data
        function (data) {

            console.log("Undo Request: " + data);
            console.log("container Request: " + paths3Holder[data]);
            console.log(paths3Holder);

            if (paths3Holder[data].length > 0){
                paths3Holder[data][paths3Holder[data].length - 1].remove();
                paths3Holder[data].pop();

            }
            // view.draw();
            //console.log("Path to be deleted: " + path3.id);
        }
    );

//==========================================================Clear screen
    var context = Mycanvas.getContext('2d');
    $("#clearScreen").click(function () {

        clearedScreen = true;

        swal({
                title: "Clear the entire screen?",
                text: "Your drawings and others' too will be lost forever!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Clear it!",
                cancelButtonText: "No, Keep drawings!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    //clear logic
                    context.clearRect(0, 0, Mycanvas.width, Mycanvas.height);

                    while(paths2Holder.length > 0) {
                        paths2Holder[paths2Holder.length - 1].remove();
                        paths2Holder.pop();
                    }
                    //var x;
                    for(x in paths3Holder){
                        console.log(x);
                        while(paths3Holder[x].length > 0) {
                            paths3Holder[x][paths3Holder[x].length - 1].remove();
                            paths3Holder[x].pop();
                        }
                    }
                    // while(paths3Holder.length > 0) {
                    //     paths3Holder[paths3Holder.length - 1].remove();
                    //     paths3Holder.pop();
                    // }

                    socket.emit('clear',"clear");

                }
                // else {
                //
                // }
            });

        // print(context);
        // console.log(context);
    });

    socket.on('clear',
        function (data) {
            console.log("Received event: " + data);

            while(paths2Holder.length > 0) {
                paths2Holder[paths2Holder.length - 1].remove();
                paths2Holder.pop();
            }
            //var x;
            for(x in paths3Holder){
                while(paths3Holder[x].length > 0) {
                    paths3Holder[x][paths3Holder[x].length - 1].remove();
                    paths3Holder[x].pop();
                }
            }


        }
    );

//=========================================================Snapshot
    var audio = new Audio('../sounds/cameraFlash.mp3');
    $("#snapshot").click(function () {
        // these two lines create an Image Object and load it with what/s on the canvas
        // var thisImage = new Image();
        thisImage = document.getElementById('myCanvas').toDataURL();

        $('.flash')
            .show()  //show the hidden div
            .animate({opacity: 0.6}, 300)
            .fadeOut(500)
            .css({'opacity': 1});

        audio.play();

        downloadURI(thisImage,"myDrawing.png");
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

    $(document).ready(function() {
        $('.flash').hide();
    });

//===============================================Handling Circles OR Brush
    $("#circle").click(function () {
        tool2.activate();
    });

    $("#brush").click(function () {
        tool1.activate();
        Dcolor = "black";
    });

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

