var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var BusinessCRUD = CRUD(connection, 'BusinessDetails');
var MemberCRUD  = CRUD(connection, 'MembershipType');
var CategoryCRUD = CRUD(connection, 'Category');

var md5 = require('md5');



exports.staticLogin = function(req, res) {
    var responsedata ={};
    BusinessCRUD.load({
      Email: req.body.email,
      Password : md5(req.body.password)
    }, function(err, val) {
      console.log(val);
        if (val.length > 0) {
            var responsedata = {
                status: true,
                data: val
            };
            res.jsonp(responsedata);
        }else{
          console.log('login failed please register');
          var responsedata = {
              status: false,
              message:'please enter valid email or password'
          };
          res.jsonp(responsedata);
        }
    });
};


exports.getCategory = function(req, res) {

    //console.log(req.body);
    CategoryCRUD.load({

    }, function(err, val) {
      //console.log(val);

      res.jsonp(val);
    });
};

exports.getMemberShipType = function(req, res) {

    //console.log(req.body);

    MemberCRUD.load({

    }, function(err, val) {
      //console.log(val);

      res.jsonp(val);
    });
};

exports.register_business = function(req, res) {
    //console.log(req.body);
    //var responsedata =req.body;
    var Password = md5(req.body.Password);
    BusinessCRUD.load({
      'Email':req.body.Email,
      'MobileNo':req.body.MobileNo
    },function(err, val) {
        console.log(val.length);
        if (val.length>0) {
            var responsedata = {
                status: 2,
                message: 'username already register'
            };
            res.jsonp(responsedata);
        }else{
          BusinessCRUD.create({
            'BusiessName':req.body.business_name,
            'MembershipType':req.body.MType,
            'Category':req.body.business_category,
            'Email':req.body.Email,
            'MobileNo':req.body.MobileNo,
            'Password':md5(req.body.Password)
          },function(error, value) {
              console.log(value);
              if(value){
                var data = {
                  status:1,
                  message:'Business Account registered',
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


exports.getbusinesslist = function(req, res) {
    BusinessCRUD.load({

    }, function(err, val) {
        if (val.length > 0) {
            var responsedata = {
                status: true,
                record: val
            };
            res.jsonp(responsedata);
        }else{
         
          var responsedata = {
              status: false,
              message:'Failed to get all business list'
          };
          res.jsonp(responsedata);
        }
    });
};

exports.deleteSinglebusiness = function(req, res){
BusinessCRUD.destroy({
    BusinessId : req.params.BusinessId
    }, function(err, val) {
        if (val) {
            var responsedata = {
                status: true,
            };
            res.jsonp(responsedata);
        }else{
         
          var responsedata = {
              status: false,
              message:'Failed to delete business'
          };
          res.jsonp(responsedata);
        }
    });
};

exports.getsingleBusiness = function(req, res) {

    BusinessCRUD.load({
       BusinessId : req.params.BusinessId
    }, function(err, val) {
        if (val.length > 0) {
            var responsedata = {
                status: true,
                record: val
            };
            res.jsonp(responsedata);
        }else{
         
          var responsedata = {
              status: false,
              message:'Failed to get all business list'
          };
          res.jsonp(responsedata);
        }
    });
};
