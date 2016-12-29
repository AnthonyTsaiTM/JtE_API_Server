var express = require('express');
var router = express.Router();
var request = require('request');
var json2xls = require('json2xls');
var fs = require('fs');
var uuid = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
	fileName = (req.originalUrl).slice(10);
	if (!fs.existsSync('./temp/' + fileName)) {
    	res.send("This file doesn't exist");
	}else{
		var fileStream = fs.createReadStream('./temp/' + fileName);
		res.setHeader('Content-type', 'application/vnd.ms-excel');
		res.setHeader('Content-disposition', 'attachment; filename=report.xlsx');
		fileStream.on('data', function (data) {
	        res.write(data);
    	});
    	fileStream.on('end', function() {
        	res.end();
    	});
	}
});


module.exports = router;
