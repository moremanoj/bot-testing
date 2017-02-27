//for database connection
var mysql = require('mysql');
var http = require('http');
var nodemailer = require('nodemailer');

var enviroment = {};
enviroment.transporter = nodemailer.createTransport({
     host : 'in-v3.mailjet.com',
     port: '587',
     auth: {
         user: '66ca4479851e0bd9cedc629bdff36ee6',
         pass: 'a3ec60f55a89f7fab98891e86818c8db'
     }
});

module.exports = enviroment;
