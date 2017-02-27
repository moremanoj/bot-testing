require('use-strict');
async = require("async");
var connect = require('connect');
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var vhost = require('vhost');

var nodemailer = require("nodemailer");

var serverport = 2001;

var bot = connect();
// Define the web folder connect and router
var web = connect();
var app = require('./api/api');

//var app = require('../api/api');

web.use(serveStatic('web'));
bot.use('/',web);

//module.export(transporter);
//console.log(__dirname);
global.appRoot = path.resolve(__dirname);
bot.listen(serverport, function () {
  console.log('listening on port '+serverport+'!');
});
