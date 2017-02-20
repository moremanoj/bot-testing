var express = require('express');
var mysql = require('mysql');
var _ = require("underscore");
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var fs = require('fs-extra');

var BusinessCRUD = CRUD(connection, 'BusinessDetails');

var md5 = require('md5');


exports.uploadProfilelogo =function(req,res){
    var imagedata = req.body.file;
    //console.log(imagedata);
    //var imagedata = filedata;
      //var imagedata1 = req.body.attachmentfile2;
    //console.log(imagedata);
    function decodeBase64Image(dataString) {

        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var response = {};
        if (matches.length !== 3) {
            return;
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        //console.log(response);
        return response;
    };

    var decodedImg = decodeBase64Image(imagedata);
    //console.log(decodedImg);
    //var decodedImg1 = decodeBase64Image(imagedata1);
    var imageBuffer = decodedImg.data;
    //var imageBuffer1 = decodedImg1.data;
    //console.log(imageBuffer)
    var type = decodedImg.type;
    //var type1 = decodedImg1.type;

    function getRandomSpan() {
           return Math.floor((Math.random() * 99999999999) + 1);
    };

    var fileName = "profile_"+req.body.id + "_logo.jpg";

    try {
           fs.writeFileSync(env.uploadpath + "profilelogo/" + fileName, imageBuffer, 'utf8');
    } catch (err) {
           console.log(err, '298');
           var response = {
               status: 0,
               message: 'INTERNAL ERROR'
           };
    }

    BusinessCRUD.update({
              BusinessId:req.body.id
            },{ logo: fileName, }, function(error, result) {
              if (result) {
                  var response = {
                      status: true,
                      record: result,
                      productimage: fileName,
                      message: 'Image successfully Updated.'
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

exports.getBusinessInfo = function(req, res) {

    //console.log(req.params);

    BusinessCRUD.load({
      'BusinessId':req.params.id
    }, function(err, val) {
      //console.log(val);

      res.jsonp(val);
    });
};

exports.staticadminLogin = function(req, res) {
    var responsedata ={};
    //console.log(req.body);
    BusinessCRUD.load({
      Email: req.body.email,
      Password : md5(req.body.password)
    }, function(err,val) {
      //console.log(val);
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


exports.updatebusiness = function(req, res) {
    var responsedata ={};
    //var second_param_key = _.keys(req.body); //: _.values(req.body)[1]};
    console.log(req.body.BusinessId);
    //var second_param_val = _.values(req.body);
    //var second_param={};
    //second_param[second_param_key] = second_param_val;
    //console.log(second_param);
    BusinessCRUD.update(
      {
        BusinessId : req.body.BusinessId
      },req.body
      , function(err,val) {
      //console.log(val);
      var resp={};

      if (!err){
          resp= {
            status : 1,
          val : val
        }
        //console.log(resp);
      }else{
       resp = {
          status : 0,
          val : val
        }
      }
      console.log(resp);
      res.jsonp(resp);
    });
};
