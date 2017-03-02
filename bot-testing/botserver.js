require('use-strict');
var connect = require('connect');
var app = connect();
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var vhost = require('vhost');

var apiai = require('apiai');

var serverport = 2001;

//var bot = connect();
var web = connect();

var app = require('./api/api');

/*var app = apiai("YOUR_ACCESS_TOKEN");

var options = {
    sessionId: '<UNIQE SESSION ID>'
};

var request = app.textRequest('Hello', options);

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
*/
web.use(serveStatic('web'));
app.use('/',web);



global.appRoot = path.resolve(__dirname);
app.listen(serverport, function () {
  console.log('listening on port '+serverport+'!');
});
