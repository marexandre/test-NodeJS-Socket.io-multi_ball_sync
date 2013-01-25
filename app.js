var express = require('express'),
    io = require('socket.io'),
    fs = require('fs');

var app    = express(),
    server = require('http').createServer(app),
    io     = io.listen(server);


app.configure(function() {
    // app.use(express.static(__dirname + '/public'));
});

// Server.
app.get('/', function(req, res){
    fs.readFile(__dirname +'/public/index.html', function(err, data){
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
});
server.listen(5000);

var users = {};

// Sockets.
io.sockets.on('connection', function(socket){

    users[socket.id] = {id: socket.id, x: 0, y: 0};

    // add user to screen.
    io.sockets.emit('add', users);

    // on user ball move.
    socket.on('move', function(data){
        users[data.id].x = data.x;
        users[data.id].y = data.y;

        io.sockets.emit('move', users);
    });

    // on user disconect.
    socket.on('disconnect', function(){
        io.sockets.emit('user disconnected', socket.id);
        delete users[ socket.id ];
    });
});