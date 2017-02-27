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

app.post('/sendmail',function(req,res){
    var data_mail= req.body;
    console.log(data_mail);
    //var mailmatter = "this is test mail";
    //send_mail($scope.email_id, mailmatter, "flight details provided.");
  });

function send_mail(usermail, mailmatter, mailmessage) {
  var mailOptions = {
      from: '<operations@80startups.com>', // sender address
      to: usermail, // list of receivers
      subject: mailmessage, // Subject line
      html: mailmatter // html body
  };
  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('Message sent: ' + info.response);
      }
  });
};

module.exports = app;
