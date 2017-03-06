require('use-strict');
var expresapp = require('express')();
var server = require('http').createServer(expresapp);
var io = require('socket.io')(server);

var serverport = 2001;

io.on('connection', function(){
  console.log('listening on port '+serverport+'!');
});
server.listen(serverport);
