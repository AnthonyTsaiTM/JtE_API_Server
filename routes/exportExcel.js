var express = require('express');
var router = express.Router();
var request = require('request');
var json2xls = require('json2xls');
var fs = require('fs');
var uuid = require('uuid');


df_url = 'http://10.104.89.134:8080/api/v2/'
df_req_conf = {
	url: 'http://10.104.89.134:8080/api/v2/', //URL to hit
	method: 'GET', //Specify the method
	headers: { //We can define headers too
	    'Content-Type': 'application/json',
	    'X-DreamFactory-Api-Key': '5ff9cf41dfad2bb96e4872e7defb59f871bfa8d322060ae3a7fec38e55b4fb72'
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
	url = (req.originalUrl).slice(5);
	filename = url.replace('/', '_');
	url = df_url + url;
	df_req_conf.url = url;
	body = req.body;
	df_req_conf.body = JSON.stringify(body);
	df_req_conf.method = 'POST';
	df_req_conf.headers['X-HTTP-METHOD'] = 'GET';
	console.log(df_req_conf);
	request(df_req_conf, function(err, response, body){
		if(err) {
			console.log(err);
	        console.log('connection error');
	    } else {
	        data = JSON.parse(body);
	        if (data['resource'] === undefined) {
	        	res.send(data);
	        	// res.send("Wrong URL");
	        } else {
	        	data = data['resource']
	        	console.log(data);
	        	var xls = json2xls(data);
	        	var xls = json2xls(data);
	        	var tempFileName = uuid.v1() + '.xlsx';
	        	fs.writeFileSync('./temp/' + tempFileName, xls, 'binary');
	        	res.send('/download/' + tempFileName);
	        	// fs.writeFileSync('./temp/report.xlsx', xls, 'binary');
	        	// res.setHeader('Content-type', 'application/vnd.ms-excel');
	        	// res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.xlsx');
	        	// res.write(xls, 'binary');
	        	// res.end();
	        }
	    }
	});
});

module.exports = router;
