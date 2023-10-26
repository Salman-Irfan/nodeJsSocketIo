const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const PORT = 5000

// routes
app.get('/', function (req, res) {
    const options = {
        root: path.join(__dirname),
    }
    let fileName = 'index.html';
    res.sendFile(fileName, options);
})

// count of total users
let users = 0

// #### connection established ######
io.on('connection', function (socket) {
    console.log(`A user connected`)
    // incrementing the user count
    users++;
    // broadcasting the message including total users
    // io.sockets.emit('broadcast', {
    //     message: `${users} users connected`
    // })

    // show welcome message to connected user
    socket.emit('newUserConnect', {
        message: `Hi, Welcome to the community of ${users} users`
    })

    // and broadcast the message to those users who were already connected
    socket.broadcast.emit('newUserConnect', {
        message: `${users} connected`
    })


    // message event
    setTimeout(function () {
        socket.send(`Sent message from server side by prereserved events`)
        // create custom event on server side
        setTimeout(function () {
            socket.emit('myCustomEvent', {
                description: 'A custom message from server side custom event'
            })
        }, 4000)
    }, 3000);
    // method 2 - catching custom client side event
    socket.on('myCustomEventFromClientSide', function(data){
        console.log(data);
    });



    // ##### disconnect #####
    socket.on('disconnect', function () {
        console.log(`A user disconnected`)
        // deccrementing the user count
        users--;
        // broadcasting the message including total users
        // io.sockets.emit('broadcast', {
        //     message: `${users} users connected`
        // })

        // and broadcast the message to those users who were already connected
        socket.broadcast.emit('newUserConnect', {
            message: `${users} connected`
        })

    });
});

http.listen(PORT, function () {
    console.log(`server is listening on http://localhost:${PORT}`);
});