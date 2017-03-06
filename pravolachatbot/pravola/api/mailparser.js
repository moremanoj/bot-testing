var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var transporter = env.transporter;
var apiai = require('apiai');
var apiapp = apiai("d3bf36baa23f41d29d41e6e0619641ae");

var LogCRUD = CRUD(connection, 'flight_log');

exports.gethi = function (req,res) {
  console.log("Calling simple get call.....");
  res.jsonp("success")
};

exports.sendmail = function(req,res){
    var data_mail= req.body;
    console.log(data_mail);
    var mailmatter = "";
    if (req.body.send_mail ==2){
      mailmatter = "Hello,</br><p>Following are mentioned details of your journey: </p>"
                        +"</br><p> Flight Type: "+req.body.S_plane_type+"</p>"
                        +"</br><p> From : "+req.body.S_addr+"</p>"
                        +"</br><p> To: "+req.body.D_addr+"</p>"
                        +"</br><p> Departure date: "+req.body.S_date+"</p>"
                        +"</br><p> At time: "+req.body.S_time+"</p>"
                        +"And for return journey :"
                        +"</br><p> Flight Type: "+req.body.R_plane_type+"</p>"
                        +"</br><p> From : "+req.body.D_addr+"</p>"
                        +"</br><p> To: "+req.body.S_addr+"</p>"
                        +"</br><p> Departure date: "+req.body.R_date+"</p>"
                        +"</br><p> At time: "+req.body.R_time+"</p>"
                        +"We wish you a safe and fun journey<br>Thank you..!!!";
    }
    else{
      mailmatter = "Hello,</br><p>Following are mentioned details of your journey: </p>"
                        +"</br><p> Flight Type: "+req.body.S_plane_type+"</p>"
                        +"</br><p> From : "+req.body.S_addr+"</p>"
                        +"</br><p> To: "+req.body.D_addr+"</p>"
                        +"</br><p> Departure date: "+req.body.S_date+"</p>"
                        +"</br><p> At time: "+req.body.S_time+"</p>"
                        +"We wish you a safe and fun journey<br>Thank you..!!!";
    }
    send_mail(data_mail.Email, mailmatter, "Flight details.");
    delete data_mail['send_mail'];
    console.log(data_mail);
    LogCRUD.create(data_mail,
       function(error, result) {
          if (result) {
              var response = {
                    status: true,
                    record: result,
                    message: 'Log updated'
              };
              res.jsonp(response);
              //callback(response);
          } else {
              var response = {
                    status: false,
                    message: 'INTERNAL ERROR'
              };
              res.jsonp(response);
              //callback(response);
          }
    });

};

 exports.apicall = function(req,res){

  console.log(req.body);

  var options = {
        sessionId: 'somerandomthing'
  };
  var request = apiapp.textRequest(req.body.msg, options);

  request.on('response', function(response) {
      //console.log("hgghghghgjhgh", response);
      res.jsonp(response);
  });

  request.on('error', function(error) {
      //console.log("error",error);
      res.jsonp(error);
  });

  request.end();
};

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
      //jsonp(response);
  });
  
};
