var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// handle cors
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

var web = require('./webshops.js');
var business = require('./business.js');
var superadmin = require('./superadmin.js');

var admin = require('./admin.js');

var product = require('./product.js');

//app.post('/api/doGoogleLogin',web.doGoogleLogin);

//app.post('/api/googleSignin',web.googleSignin);

//admin
app.post('/api/staticadminLogin',admin.staticadminLogin);
app.post('/api/updatebusiness',admin.updatebusiness);
app.post('/api/uploadProfilelogo',admin.uploadProfilelogo);
app.get('/api/getBusinessInfo/:id',admin.getBusinessInfo);

//product
app.get('/api/getproducts/:id',product.getproducts);
app.get('/api/getproductsold/:id',product.getproductsold);
app.get('/api/getproductsdetails/:id',product.getproductsdetails);
app.post('/api/addproduct',product.addproduct);
app.post('/api/updateproduct',product.updateproduct);
app.post('/api/deleteproduct',product.deleteproduct);
app.post('/api/product_disable',product.product_disable);
app.post('/api/product_enable',product.product_enable);

//public
app.post('/api/register_business',business.register_business);
app.get('/api/getMemberShipType',business.getMemberShipType);
app.get('/api/getCategory',business.getCategory);
app.post('/api/staticLogin',business.staticLogin);

//superadmin Api's
app.post('/api/addsuperAdmin',superadmin.addsuperAdmin);
app.post('/api/superadminlogin',superadmin.superadminlogin);
app.get('/api/getbusinesslist' , business.getbusinesslist);
app.get('/api/deleteSinglebusiness/:BusinessId' , business.deleteSinglebusiness);
app.get('/api/getsingleBusiness/:BusinessId' , business.getsingleBusiness);

module.exports = app;
