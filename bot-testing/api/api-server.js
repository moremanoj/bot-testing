#!/usr/bin/env node

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var passport = require('passport');

var debug = require('debug')('templates:server');
var http = require('http');

var router = express.Router();
var app = express();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4500');

/**
 * Create HTTP server.
 */

var server = http.createServer(app);



// /app.use(logger('dev'));
//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(validator());


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


//app.use('/', express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/', express.static(__dirname + '/web'));
app.use('/superadmin', express.static(__dirname + '/superadmin'));
//app.use('/clone', express.static(__dirname + '/clone'));
app.use('/api', express.static(__dirname + '/api'));
app.use('/mobile', express.static(__dirname + '/mobile/www'));
app.use('/docs', express.static(__dirname + '/apidocs'));
app.use('/mobileshop', express.static(__dirname + '/mobileshop'));
app.use('/wineshop', express.static(__dirname + '/wineshop'));
app.use('/fashion', express.static(__dirname + '/fashion'));
app.use('/business', express.static(__dirname + '/business'));

var userlogin = require('./api/userlogin.js');
var todos = require('./api/todos.js');
var device_register = require('./api/device_register.js');
var adminlogin = require('./api/adminLogin');
var userProducts = require('./api/user_product.js');


/***Super admin api****/
var sadmin_userlogin = require('./api/sadmin/superadmin.js');
var sadmin_vendors = require('./api/sadmin/vendors.js');
var sadmin_mainCategory = require('./api/sadmin/main_category.js');
var sadmin_category = require('./api/sadmin/category.js');
var sadmin_subcategory = require('./api/sadmin/sub_category.js');
var sadmin_product = require('./api/sadmin/product.js');
var sadmin_tasMaster = require('./api/sadmin/tax_master.js');

/***Super admin api end****/

/***Shopowner api****/
var shop_vendors = require('./api/shopowner/vendors.js');
var shop_category = require('./api/shopowner/category.js');
var shop_subcategory = require('./api/shopowner/sub_category.js');
var shop_product = require('./api/shopowner/product.js');
var shop_discount = require('./api/shopowner/discount.js');
var shop_vendorTaxMaster = require('./api/shopowner/vendor_tax_master.js');
/***Shopowner api end****/

var productRating = require('./api/product_rating.js');
var currency = require('./api/currency.js');
var users = require('./api/users.js');

/** business api's**/
var business = require('./api/business.js');
var bus_maincategory = require('./api/maincategory.js');
var bus_category  = require('./api/category.js');
/** business api's end**/

//var sendpushnotification = require('./api/sendpushnotification.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/api/bus_maincategory', bus_maincategory);
app.use('/api/business', bus_category);

app.post('/api/signup', userlogin.signup);
app.post('/api/login', userlogin.login);
app.post('/api/fblogin', userlogin.fblogin);
app.get('/api/verify/:id', userlogin.verify);

/*app.get('/api/verify/:id', function(req, res) {
    var errors = req.validationErrors();
    if (errors) {
      res.send(errors);
      return;
    }else{
      return userlogin.verify;
    }
});*/

app.get('/api/getUserDetails/:id', users.findById);
app.post('/api/updateUser', users.updateUser);


app.post('/api/adminlogin', sadmin_userlogin.login);

app.get('/api/getalluserproducts/:id', userProducts.getUserProducts);
app.get('/api/getAllProductBySuperCategory/:sid', userProducts.getAllProductBySuperCategory);
app.get('/api/getAllProductByCategory/:cid', userProducts.getAllProductByCategory);
app.post('/api/getUserProducts', userProducts.getUserProducts);
app.get('/api/getproductbyid/:pid', userProducts.findById);
app.post('/api/addproduct', userProducts.insertProduct);
app.post('/api/editProduct', userProducts.updateProduct);
app.get('/api/deleteProduct/:id', userProducts.deleteProduct);
app.get('/api/allproduct', userProducts.findAll);
app.post('/api/getProductImages', userProducts.getProductImages);


app.get('/api/allcurrency', currency.findAll);

app.post('/api/addtodos', todos.addtodos);
app.post('/api/gettodos', todos.gettodos);
app.post('/api/gettododetails', todos.gettododetails);
app.post('/api/updatetodos', todos.updatetodos);
app.post('/api/deletetodo', todos.deletetodo);
app.post('/api/deviceregister', device_register.deviceregister);

app.post('/api/adminLogin', adminlogin.login);

/**Suerp admin Vendors api**/
app.get('/api/admin/allvendors', sadmin_vendors.findAll);
app.get('/api/admin/getvendor/:id', sadmin_vendors.findById);
app.post('/api/admin/addvendor', sadmin_vendors.insertVendor);

app.post('/api/admin/editvendor', sadmin_vendors.updateVendor);

app.post('/api/admin/deletevendor', sadmin_vendors.deleteVendor);
/**super admin Vendors api end here**/

/**Super admin main category api**/
app.get('/api/admin/maincategory', sadmin_mainCategory.findAll);

app.get('/api/admin/maincategoryarray', sadmin_mainCategory.getdataArray);


app.get('/api/admin/getmaincategory/:id', sadmin_mainCategory.findById);
app.post('/api/admin/addmaincategory', sadmin_mainCategory.insertMainCategory);
app.post('/api/admin/editmaincategory', sadmin_mainCategory.updateMainCategory);
app.get('/api/admin/deletemaincategory/:id', sadmin_mainCategory.deleteMainCategory);

//app.post('/api/admin/editmaincategory', sadmin_mainCategory.updateMainCategory);
app.get('/api/admin/viewMainCategory/:id', sadmin_mainCategory.viewMainCategory);
app.get('/api/admin/getAllParentChildCategory', sadmin_mainCategory.getAllParentChildCategory);


/**Super admin main category api end here**/

/**Super admin category api**/
app.get('/api/admin/allcategory', sadmin_category.findAll);
app.get('/api/admin/getcategory/:id', sadmin_category.findById);
app.post('/api/admin/addcategory', sadmin_category.insertCategory);
app.post('/api/admin/editcategory', sadmin_category.updateCategory);
app.get('/api/admin/deletecategory/:id', sadmin_category.deleteCategory);
app.get('/api/admin/viewCategory/:id', sadmin_category.viewCategory);
app.get('/api/admin/getCategoryfromSuperCategory/:id', sadmin_category.getCategoryfromSuperCategory);


/**Super admin category api end here**/

/**Super admin sub category api**/
app.get('/api/admin/allsubcategory', sadmin_subcategory.findAll);
app.get('/api/admin/getsubcategory/:id', sadmin_subcategory.findById);
app.post('/api/admin/addsubcategory', sadmin_subcategory.insertSubCategory);
app.post('/api/admin/editsubcategory', sadmin_subcategory.updateSubCategory);
app.get('/api/admin/deletesubcategory/:id', sadmin_subcategory.deleteSubCategory);
/**Super admin sub category api end here**/

/**Super admin products api**/
app.get('/api/admin/allproduct', sadmin_product.findAll);
app.get('/api/admin/getproduct/:id', sadmin_product.findById);
app.post('/api/admin/addproduct', sadmin_product.insertProduct);
app.post('/api/admin/editproduct', sadmin_product.updateProduct);
app.post('/api/admin/deleteproduct', sadmin_product.deleteProduct);
/**Super admin products api end here**/

/**Super admin Tax master api**/
app.get('/api/admin/allTaxMaster', sadmin_tasMaster.findAll);
app.get('/api/admin/gettaxmaster/:id', sadmin_tasMaster.findById);
app.post('/api/admin/addtaxmaster', sadmin_tasMaster.insertTaxMaster);
app.post('/api/admin/editTaxMaster', sadmin_tasMaster.updateTaxMaster);
app.post('/api/admin/deleteTaxmaster', sadmin_tasMaster.deleteTaxMaster);
/**Super admin Tax master api end here**/

/**Shopowner api**/
app.get('/api/shop/allvendors', shop_vendors.findAll);
app.get('/api/shop/getvendor/:id', shop_vendors.findById);
app.post('/api/shop/addvendor', shop_vendors.insertVendor);
app.post('/api/shop/editvendor', shop_vendors.updateVendor);
app.post('/api/shop/deletevendor', shop_vendors.deleteVendor);
/**Shopowner api end here**/

/**Shopowner category api**/
app.get('/api/shop/allcategory', shop_category.findAll);
app.get('/api/shop/getcategory/:id', shop_category.findById);
app.post('/api/shop/addcategory', shop_category.insertCategory);
app.post('/api/shop/editcategory', shop_category.updateCategory);
app.post('/api/shop/deletecategory', shop_category.deleteCategory);
/**Shopowner category api end here**/

/**Shopowner sub category api**/
app.get('/api/shop/allsubcategory', shop_subcategory.findAll);
app.get('/api/shop/getsubcategory/:id', shop_subcategory.insertSubCategory);
app.post('/api/shop/editsubcategory', shop_subcategory.updateSubCategory);
app.post('/api/shop/deletesubcategory', shop_subcategory.deleteSubCategory);
/**Shopowner sub category api end here**/

/**Shopowner products api**/
app.get('/api/shop/allproduct', shop_product.findAll);
app.get('/api/shop/getproduct/:id', shop_product.findById);
app.post('/api/shop/addproduct', shop_product.insertProduct);
app.post('/api/shop/editproduct', shop_product.updateProduct);
app.post('/api/shop/deleteproduct', shop_product.deleteProduct);
/**Shopowner products api end here**/


/**Shopowner tax master api**/
app.get('/api/shop/allVendorsTaxMaster', shop_vendorTaxMaster.findAll);
app.get('/api/shop/getvendortaxmaster/:id', shop_vendorTaxMaster.findById);
app.post('/api/shop/addvendortaxmaster', shop_vendorTaxMaster.insertVendorTaxMaster);

app.post('/api/shop/editvendortaxmaster', shop_vendorTaxMaster.updateVendorTaxMaster);

app.post('/api/shop/deleteVendortaxmaster', shop_vendorTaxMaster.deleteVendortaxmaster);
/**Shopowner tax master api end here**/

/**Shopowner discounts api**/
app.get('/api/shop/alldiscount', shop_discount.findAll);
app.get('/api/shop/getdiscount/:id', shop_discount.findById);
app.post('/api/shop/adddiscount', shop_discount.insertDiscount);
app.post('/api/shop/editdiscount', shop_discount.updateDiscount);
app.post('/api/shop/deletediscount', shop_discount.deleteDiscount);
/**Shopowner discounts api end here**/

/**product ratings api**/
app.get('/api/getproductrating/:id', productRating.findById);
app.post('/api/addproductrating', productRating.insertProductRating);
app.post('/api/editproductrating', productRating.updateProductRating);
app.post('/api/deleteproductrating', productRating.deleteProductRating);
/**product ratings api end here**/

/*app.get('/api/sendnotification',sendpushnotification.sendnotification);*/

/*business apis*/
app.post('/api/addusers', business.addusers);
app.get('/api/getbusinesslist/:userid' , business.getbusinesslist);
app.get('/api/deletebusinessrecord/:business_id' , business.deletebusiness);
app.get('/api/getbusinessdetails/:id' , business.getbusinessdetails);
app.post('/api/updateuserdetails', business.updateuserdetails);


/*business module api */
app.post('/api/businesslogin', business.businesslogin);

module.exports = app;

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
//server.on('error', onError);
//server.on('listening', onListening);
console.log('listening', port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
