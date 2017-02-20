    var express = require('express');
    var mysql = require('mysql');
    var _ = require("underscore");
    var CRUD = require('mysql-crud');
    var env = require('./environment');
    var connection = env.Dbconnection;
    var fs = require('fs-extra');

    var ProductCRUD = CRUD(connection, 'product_detail');

    var md5 = require('md5');

    exports.addproduct =function(req,res){
        var productdata = req.body;
        //console.log(productdata.product_images);
        var temp_files =[];
        async.each(productdata.product_images, function(image, nextImage) {
              // Call an asynchronous function, often a save() to DB
              //console.log(image);
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
              var decodedImg = decodeBase64Image(image.file);
              var imageBuffer = decodedImg.data;

              var type = decodedImg.type;

              function getRandomSpan() {
                     return Math.floor((Math.random() * 99999999999) + 1);
              };

              var fileName = "product_"+ getRandomSpan() + "img.jpg";
              try {
                   fs.writeFileSync(env.uploadpath + "product/" + fileName, imageBuffer, 'utf8');
                   //filename= env.uploadpath + "product/" + fileName;
                   temp_files.push(fileName);
              }
              catch (err) {
                   console.log(err, '298');
                   var response = {
                       status: 0,
                       message: 'INTERNAL ERROR'
                   };
              }
              nextImage();
          },
          // 3rd param is the function to call when everything's done
          function(err, nextImage) {
              // All tasks are done now
              var responsedata = {
                  status: true,
                  message: 'product Inserted successfully'
              };
              //res.jsonp(responsedata);
          });
          //console.log(temp_files);
          //console.log(temp_files);

          //console.log(productdata);
          var productnew = {
            name : productdata.name,
            BusinessId : productdata.BusinessId,
            qty : productdata.qty,
            desc : productdata.desc,
            price : productdata.price,
            status : productdata.status
          }
          for (var i=0;i<temp_files.length;i++){
            productnew['product_image'+(i+1)]=temp_files[i];
          }
          //console.log(productnew);

          ProductCRUD.create(productnew,
             function(error, result) {
                if (result) {
                    var response = {
                          status: true,
                          record: result,
                          message: 'product details successfully Inserted.'
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


    exports.getproductsold=function (req,res) {
      ProductCRUD.load({
        'BusinessId':req.params.id,
        'status':'disabled'
      }, function(err, val) {
          //console.log(val);
        res.jsonp(val);
      });
    };

    exports.deleteproduct=function (req,res) {

      console.log(req.body);
      ProductCRUD.destroy({
        'id':req.body.id
      }, function(err, val) {
          //console.log(val);
        res.jsonp(val);
      });
    };

    exports.product_enable=function (req,res) {
      //console.log(req.body);
      ProductCRUD.update({
        id:req.body.id
      },{status:'Active'}, function(err, val) {
          //console.log(val);
        res.jsonp(val);
      });
    };
    exports.getproducts=function (req,res) {
      ProductCRUD.load({
        'BusinessId':req.params.id,
        'status':'Active'
      }, function(err, val) {
          //console.log(val);
        res.jsonp(val);
      });
    };

    exports.product_disable=function (req,res) {
      //console.log(req.body);
      ProductCRUD.update({
        id:req.body.id
      },{status:'disabled'}, function(err, val) {
          //console.log(val);
        res.jsonp(val);
      });
    };

    exports.getproductsdetails=function (req,res) {
      ProductCRUD.load({
        'Id':req.params.id
      }, function(err, val) {
          //console.log(val);
        res.jsonp(val);
      });
    };

    exports.updateproduct =function(req,res){
        var productdata = req.body;
        //console.log(productdata.product_images);
        var temp_files =[];
        async.each(productdata.product_images, function(image, nextImage) {
              // Call an asynchronous function, often a save() to DB
              //console.log(image);
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
              var decodedImg = decodeBase64Image(image.file);
              var imageBuffer = decodedImg.data;

              var type = decodedImg.type;

              function getRandomSpan() {
                   return Math.floor((Math.random() * 99999999999) + 1);
              };

              var fileName = "product_"+ getRandomSpan() + "img.jpg";
              try {
                   fs.writeFileSync(env.uploadpath + "product/" + fileName, imageBuffer, 'utf8');
                   //filename= env.uploadpath + "product/" + fileName;
                   temp_files.push(fileName);
              }
              catch (err) {
                   console.log(err, '298');
                   var response = {
                          status: 0,
                          message: 'INTERNAL ERROR'
                    };
              }
              nextImage();
        },
        // 3rd param is the function to call when everything's done
        function(err, nextImage) {
        // All tasks are done now
        var responsedata = {
            status: true,
            message: 'product Inserted successfully'
        };
        //res.jsonp(responsedata);
      });
          //console.log(temp_files);
          //console.log(temp_files);

          //console.log(productdata);
      var productnew = {
            name : productdata.name,
            BusinessId : productdata.BusinessId,
            qty : productdata.qty,
            desc : productdata.desc,
            price : productdata.price
      }

      for (var i=0,j=0;j<temp_files.length;i++){
        if(productdata['product_image'+(i+1)] == null){
            productnew['product_image'+(i+1)] = temp_files[j];
            j++;
        }
        else{
              productnew['product_image'+(i+1)] =productdata['product_image'+(i+1)];
            }
      }
      //console.log(productnew);
      //console.log(productdata.id);


      ProductCRUD.update({
        id:productdata.id
      },productnew,
        function(error, result) {
              if (result) {
                  var response = {
                        status: true,
                        record: result,
                        message: 'product details successfully Updated.'
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

    var uploadPic = function( filedata, imageFor, callback) {
        var imagedata = filedata;
        var result ={};
        //var imagedata1 = req.body.attachmentfile2;
        //console.log(imagedata.file);
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

        var decodedImg = decodeBase64Image(imagedata.file);
        //console.log(decodedImg);
        //var decodedImg1 = decodeBase64Image(imagedata1);
        var imageBuffer = decodedImg.data;
        //var imageBuffer1 = decodedImg1.data;

        var type = decodedImg.type;
        //var type1 = decodedImg1.type;
        function getRandomSpan() {
               return Math.floor((Math.random() * 99999999999) + 1);
        };

        var fileName = "product_"+ getRandomSpan() + "img.jpg";

        try {
               fs.writeFileSync(env.uploadpath + "product/" + fileName, imageBuffer, 'utf8');
               result= {
                filename: fileName,
                status: 1
              }
        } catch (err) {
               console.log(err, '298');
               response = {
                   status: 0,
                   message: 'INTERNAL ERROR'
               };
        }
        //console.log(result);
        return result;

    }
