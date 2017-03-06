//for database connection
var mysql = require('mysql');
var http = require('http');
var nodemailer = require('nodemailer');

var enviroment = {
	Dbconnection : mysql.createPool({
			database : 'pravolachatbot',
		    user : 'ftdev',
			password : '10gXWOqeaf',
		    host :'apps.fountaintechies.com',
		    /*database : 'shopcart',
		    user : 'root',
			password : '',
		    host :'localhost',*/
	}),
	/** Function For Time stamp**/
	timestamp: function() {
      var UTCtimestamp = new Date();
      return UTCtimestamp.getTime();
    }
}
enviroment.transporter = nodemailer.createTransport({
     host : 'in-v3.mailjet.com',
     port: '587',
     auth: {
         user: '66ca4479851e0bd9cedc629bdff36ee6',
         pass: 'a3ec60f55a89f7fab98891e86818c8db'
     }
});

module.exports = enviroment;
