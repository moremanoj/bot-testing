var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var webCRUD = CRUD(connection, 'BusinessDetails');
var UserCRUD = CRUD(connection, 'PersonalDetails');

var md5 = require('md5');


exports.googleSignin = function(req, res) {

    //console.log(req.body);
    var responsedata ={};
    UserCRUD.load({
      Email: req.body.Email,
      GoogleUserRef : req.body.GoogleUserRef

    }, function(err, val) {
      //console.log(val);
        if (val.length > 0) {
            var responsedata = {
                status: true,
                data: val
            };
            res.jsonp(responsedata);
        }
    });
};

exports.doGoogleLogin = function(req, res) {
    //console.log(req.body);
    //var responsedata =req.body;
    UserCRUD.load({
      'Email':req.body.Email
    },function(err, val) {
        //console.log(val);
        if (val.length > 0) {
            var responsedata = {
                status: 2,
                message: 'username already register'
            };
            res.jsonp(responsedata);
        }else{
          UserCRUD.create({
            'FirstName':req.body.FirstName,
            'LastName':req.body.LastName,
            'GoogleUserRef':req.body.GoogleUserRef,
            'Email':req.body.Email
          },function(error, value) {
              //console.log(value);
              if(value){
                var data = {
                  status:1,
                  message:'google user registered',
                  record:value
                };
              }
              else{
                var data = {
                  status:0,
                  message:'Failed to register',
                  record:value
                };
              }
              res.jsonp(data);
          });
        }
    });
};
