var express = require('express');
var router = express.Router();
var request = require('request');
var json2xls = require('json2xls');
var fs = require('fs');
var uuid = require('uuid');


req_conf = {
	url: 'http://localhost:3000', //URL to hit
	method: 'POST', //Specify the method
	headers: { //We can define headers too
	    'Content-Type': 'application/json',
	}
};
/* GET home page. */
router.get('/', function(req, res, next) {
	url = (req.originalUrl).slice(5);
	filename = url.replace('/', '_');
	url = df_url + url;
	df_req_conf.url = url;
	df_req_conf.method = 'GET';
	console.log(df_req_conf);
	request(df_req_conf, function(err, response, body){
		if(err) {
			console.log(err);
	        console.log('connection error');
	    } else {
	        data = JSON.parse(body);
	        if (data['resource'] === undefined) {
	        	res.send("Wrong URL");
	        } else {
	        	data = data['resource']
	        	var xls = json2xls(data);
	        	// console.log(data);
	        	res.setHeader('Content-type', 'application/vnd.ms-excel');
	        	res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.xlsx');
	        	res.write(xls, 'binary');
	        	res.end();
	        }
	    }
	});
});

router.post('/', function(req, res, next) {
	url = "http://localhost:3000/data/reportview"
	req_conf.url = url;
	body = req.body;
	req_conf.body = JSON.stringify(body);
	req_conf.method = 'POST';
	// console.log(req_conf);
	request(req_conf, function(err, response, body){
		if(err) {
			console.log(err);
	        console.log('connection error');
	    } else {
	        data = JSON.parse(body);
        	console.log(data);
        	var xls = json2xls(data);
        	var xls = json2xls(data);
        	var tempFileName = uuid.v1() + '.xlsx';
        	fs.writeFileSync('./temp/' + tempFileName, xls, 'binary');
        	console.log('/download/' + tempFileName);
        	res.send('/download/' + tempFileName);
	    }
	});
});

module.exports = router;
