var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var enquiryCRUD = CRUD(connection, 'enquiry');

var nodemailer = require('nodemailer');
var transporter = env.transporter;

exports.addenquiry = function(req, res) {

    console.log(req.body);
    var fullName = req.body.first_name + '' + req.body.last_name;
        if(!req.body.plan) req.body.plan = '';
    if(!req.body.package) req.body.package = '';
    if(!req.body.message) req.body.message = '';
    enquiryCRUD.create({
        'firstName': req.body.first_name,
        'lastName': req.body.last_name,
        'email': req.body.email,
        'contactNumber': req.body.contactNumber,
        'discription':req.body.Description
        
    }, function(error, result) {
      console.log('22', error);
        // if(error) console.log(error);
        if (error) {
            var response = {
                status: false,
                message: 'INTERNAL ERROR',
                error: error
            };
            console.log("error:",error);
            res.jsonp(response);
        } else {
            var response = {   
                status: true,
                message: 'Enquiry info successfully sent.',
                val: result
            };
            //console.log("result:",result);
            res.jsonp(response);
            var mailmatter = "<table align='center' style='background:#efefef;' cellspacing='30'><tbody><tr><td align='center'></td></tr><tr><td align='center'><table cellspacing='15' ><tbody ><tr><td><h1> New Enquiry Added with following details: </h1></td></tr><tr><td><h3 style='margin-bottom: -5px;'></h3></td></tr><tr><td> </td></tr><tr><td>Name: <b>"+ fullName +"</b></td></tr><tr><td>Contact Email: <b>"+req.body.email+"</b></td></tr><tr><td>Contact Number: <b>"+req.body.contactNumber+"</b></td></tr></tbody></table></td></tr></tbody></table>";
            send_mail(mailmatter,'New Enquiry');
        }
    });
};




exports.sparkincontactform = function(req, res) {
    console.log('in sparkincontactform ',req.body);
    consultancyCRUD.create({
        'userName': req.body.user_name,
        'email': req.body.contact_email,
        'contactNumber': req.body.contact_number,
        'description': req.body.description,
        'created_on': env.timestamp()
    }, function(error, result) {
        // if(error) console.log(error);
        if (error) {
            var response = {
                status: false,
                message: 'INTERNAL ERROR',
                error: error
            };
            console.log("error:",error);
            res.jsonp(response);
        } else {
            var response = {
                status: true,
                message: 'Info successfully Sent.',
                val: result
            };
            //console.log("result:",result);
            res.jsonp(response);
            var mailmatter = "<table align='center' style='background:#efefef;' cellspacing='30'><tbody><tr><td align='center'></td></tr><tr><td align='center'><table cellspacing='15' ><tbody ><tr><td><h1> New Enquiry for CreateMobileShop Added with following details: </h1></td></tr><tr><td><h3 style='margin-bottom: -5px;'></h3></td></tr><tr><td> </td></tr><tr><td>Name: <b>"+req.body.user_name+"</b></td></tr><tr><td>Contact Email: <b>"+req.body.contact_email+"</b></td></tr><tr><td>Contact Number: <b>"+req.body.contact_number+"</b></td></tr><tr><td>Description: <b>"+req.body.description+"</b></td></tr></tbody></table></td></tr></tbody></table>";
            send_mail(mailmatter,'New Enquiry is Added ');
        }
    });
};
//function for sending email
 function send_mail(mailmatter,subject) {
    var mailOptions = {
        from: 'New Enquiry<operations@80startups.com>', // sender address
        to: 'saurabh<saurabh.undre@80startups.com>', // list of receivers
        //cc: 'Amol Chawathe<ceo@80startups.com>', // list of receivers
      // bcc: ['saurabh.undre@80startups.com', '"Ankush" <ankush@80Startups.com>'],
        subject: subject, // Subject line
        html: mailmatter // html body
      };
      //console.log(mailOptions);
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}
