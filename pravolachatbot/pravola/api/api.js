var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var env = require('./environment');
var transporter = env.transporter;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', false);
  next();
});

app.use(bodyParser.json({ limit: '50mb', extended: true, type:'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, type:'application/x-www-form-urlencoding' }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ limit: '50mb' }));

var mailparser = require('./mailparser.js');


app.get('/api/gethi',mailparser.gethi);

app.post('/api/sendmail',mailparser.sendmail);

//app.post('/api/apicall',mailparser.apicall);
app.post('/api/apicall',mailparser.apicall);

module.exports = app;
