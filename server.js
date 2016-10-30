const express  = require('express');
const app      = express();
const port = 8000;
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var uuid = require('uuid-random');

var oUsers = {};


// routes ======================================================================
require('./server/routes.js')(app);
app.set('view engine', 'ejs'); // set up ejs for templating
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/", express.static(__dirname + '/'));


io.on('connection', function (socket) {
    var ownUuid = uuid();
    console.log("New Connection: "+ownUuid);

    socket.on('disconnect', function(){
        console.log('Disconnected: '+ownUuid);
        delete(oUsers[ownUuid]);
        socket.broadcast.emit('userDisconnected', {
            uuid: ownUuid
        });
    });

    socket.on('register', function(sName){
        console.log('Register: '+sName);
        socket.emit('registerOk', {connectedUsers:oUsers});

        socket.broadcast.emit('newUser', {
            name: sName,
            uuid: ownUuid,
            inCoffee: false
        });

        oUsers[ownUuid] = {
            name: sName,
            inCoffee: false
        };
    });

    socket.on('changeStatus', function(bStatus){
        oUsers[ownUuid].inCoffee = bStatus;
        socket.broadcast.emit('statusChanged', {
            uuid: ownUuid,
            inCoffee: bStatus
        })
    });



    /*socket.emit('priceUpdate',currentPrice);
     socket.on('bid', function (data) {
     currentPrice = parseInt(data);
     socket.emit('priceUpdate',currentPrice);
     socket.broadcast.emit('priceUpdate',currentPrice);
     });*/
});




server.listen(port);
io.set("origins", "*:*");