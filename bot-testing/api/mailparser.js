var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var env = require('./environment');
var transporter = env.transporter;


exports.gethi = function (req,res) {
  console.log("Calling simple get call.....");
  res.jsonp("success")
};
