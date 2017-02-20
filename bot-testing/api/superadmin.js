var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var SuperadminCRUD = CRUD(connection, 'Superadmin');
var md5 = require('md5');



exports.addsuperAdmin = function(req, res) {
    SuperadminCRUD.load({
        'superAdminEmail':req.body.superAdminEmail,
        'userName' : req.body.userName
    },function(err , val){
      if(val.length >0 ){
        var data = {
                    status:2,
                    message:'Already registered',
                    record:val
                }
                 res.jsonp(data);
      }else{
          SuperadminCRUD.create({
            'superAdminName':req.body.superAdminName,
            'superAdminEmail':req.body.superAdminEmail,
            'userName':req.body.userName,
            'password': md5(req.body.password),
            'address':req.body.address,
            'createdOn': env.timestamp(),
            'modifiedOn': env.timestamp()
          },function(error, value) {
              if(value){
                var data = {
                  status:1,
                  message:'superadmin Account registered',
                  record:value
                };
              }
              else{
                console.log(error);
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



// business module login
exports.superadminlogin = function(req,res){
      var username = req.body.userName;
      var password = md5(req.body.password);
      SuperadminCRUD.load({
        userName : username,
        password : password
      }, function (err, val) {
        var resdata={
            record:'',
            status:false,
            message :'err'
        };
        if(val.length > 0){
          resdata.record=val;
          resdata.status=true;
          resdata.message='successfully login welcome ';
        }else{
          resdata.status = false;
          resdata.message = 'Wrong username or password combination';
      }
      res.jsonp(resdata);
  });
};