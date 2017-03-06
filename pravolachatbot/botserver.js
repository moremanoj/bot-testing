require('use-strict');
var connect = require('connect');
var app = connect();

var expresapp = require('express')();
var server = require('http').createServer(expresapp);
var io = require('socket.io')(server);

var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var vhost = require('vhost');

var apiai = require('apiai');

var serverport = 2001;

//var bot = connect();
var web = connect();
var app = require('./api/api');


web.use(serveStatic('web'));
app.use('/',web);

global.appRoot = path.resolve(__dirname);
/*app.listen(serverport, function () {
  console.log('listening on port '+serverport+'!');
});
*/
io.on('connection', function(){
  console.log('listening on port '+serverport+'!');
});
server.listen(serverport);
