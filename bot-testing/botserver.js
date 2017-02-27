require('use-strict');
async = require("async");
var connect = require('connect');
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var vhost = require('vhost');

var serverport = 2001;

var app = connect();
// Define the web folder connect and router
var web = connect();

//var app = require('../api/api');

web.use(serveStatic('web'));
app.use('/',web);


//console.log(__dirname);
global.appRoot = path.resolve(__dirname);
app.listen(serverport, function () {
  console.log('listening on port '+serverport+'!');
});
