require('use-strict');
var connect = require('connect');
var app = connect();
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var vhost = require('vhost');

var serverport = 2001;

//var bot = connect();
var web = connect();

var app = require('./api/api');


web.use(serveStatic('web'));
app.use('/',web);



global.appRoot = path.resolve(__dirname);
app.listen(serverport, function () {
  console.log('listening on port '+serverport+'!');
});
