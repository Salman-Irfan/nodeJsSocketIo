const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const PORT = 5000;

// Serve the index.html file
app.get('/', function (req, res) {
    const options = {
        root: path.join(__dirname),
    };
    let fileName = 'index.html';
    res.sendFile(fileName, options);
});

// Serve the index.html file for the custom-namespace path
app.get('/custom-namespace', function (req, res) {
    const options = {
        root: path.join(__dirname),
    };
    let fileName = 'index.html';
    res.sendFile(fileName, options);
});
// Count of total users
let users = 0;



// Connection established
io.on('connection', function (socket) {
    console.log(`A user connected`);
    // Incrementing the user count
    users++;

    // Show a welcome message to the connected user
    socket.emit('newUserConnect', {
        message: `Hi, Welcome to the community of ${users} users`
    });

    // Broadcast the message to those users who were already connected
    socket.broadcast.emit('newUserConnect', {
        message: `${users} connected`
    });

    // Sending a message from the server side
    socket.send(`Sent message from the server side by pre-reserved events`);

    // Create a custom event on the server side
    setTimeout(function () {
        socket.emit('myCustomEvent', {
            description: 'A custom message from the server side custom event'
        });
    }, 4000);

    // Method 2: Catching custom client-side event
    socket.on('myCustomEventFromClientSide', function (data) {
        console.log(data);
    });

    // Disconnect
    socket.on('disconnect', function () {
        console.log(`A user disconnected`);
        // Decrementing the user count
        users--;
        // Broadcast the message to those users who were already connected
        socket.broadcast.emit('newUserConnect', {
            message: `${users} connected`
        });
    });
});

// Custom namespace in Socket.IO
const cnsp = io.of('/custom-namespace');

// Custom namespace event handling
cnsp.on('connection', function (socket) {
    console.log(`A user connected to custom namespace`);
    // Incrementing the user count
    users++;

    // // // Show a welcome message to the connected user
    // socket.emit('newUserConnect', {
    //     message: `Hi, Welcome to the community of ${users} users`
    // });

    // Emit a custom event on the custom namespace
    cnsp.emit('namespaceEvent', 'Custom namespace Tester Event Called');

    // Broadcast the message to those users who were already connected
    socket.broadcast.emit('newUserConnect', {
        message: `${users} connected`
    });

    // Disconnect
    socket.on('disconnect', function () {
        users--;
        console.log(`A user disconnected from the custom namespace`);
    });
});

// Listen on the specified port
http.listen(PORT, function () {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
