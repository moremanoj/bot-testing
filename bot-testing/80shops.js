require('use-strict');
async = require("async");
var connect = require('connect');
var app = connect();
var path = require('path');

var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var vhost = require('vhost');

var serverport = 7000;

// Define the web folder connect and router
var web = connect();
var html = connect();
var superadmin = connect();
var admin = connect();
var assets = connect();

var app = require('../api/api');

web.use(serveStatic('public'));
app.use('/',web);

html.use(serveStatic('html'));
app.use('/html',html);

superadmin.use(serveStatic('superadmin'));
app.use('/superadmin',superadmin);

admin.use(serveStatic('admin'));
app.use('/admin',admin);

assets.use(serveStatic('../assets'));
app.use('/assets',assets);

//console.log(__dirname);
global.appRoot = path.resolve(__dirname);
app.listen(serverport, function () {
  console.log('listening on port '+serverport+'!');
});
