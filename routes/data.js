var config = require('../config');
var express = require('express');
var mysql = require('mysql');
var moment = require('moment');
var router = express.Router();
var database = require('../database');

router.post('/reportview', function(req, res, next){
	try{
        console.log(req.body);
		var system_names = req.body['system_names'];
		var statuses = req.body['statuses'];
		var datacenters = req.body['datacenters'];
		var start_date = moment(req.body['start_date']).format('YYYY-MM-DD','YYYY-MM-DD');
        if ((start_date > end_date) or (!moment(start_date).isValid()) or (!moment(end_date).isValid())) {
            return res.send("date error");
        }
		var end_date = moment(req.body['end_date']).format('YYYY-MM-DD','YYYY-MM-DD');
		var condition = '(datetime between \"' + start_date + '\" and \"' + end_date + "\") and 1=1 ";
		var count = 0;
		count = system_names.length;
		if (count != 0) {
			condition += 'and SystemName in (' + system_names.map(function(system_name){return "'" + system_name + "'";}).join(',') + ') ';
		}
		count = statuses.length;
		if (count != 0) {
			condition += 'and Status in (' + statuses.map(function(status){return "'" + status + "'";}).join(',') + ') ';
		}
		count = datacenters.length;
		if (count != 0) {
			condition += 'and DataCenter in (' + datacenters.map(function(datacenter){return "'" + datacenter + "'";}).join(',') + ') ';
		}
	} catch(err) {
		console.log(err);
		return res.send("params error");
	}
	

	var sql_query = "\
					SELECT \
        				`DailyView`.`Name` AS `Name`, \
        				`DailyView`.`NumCPUs` AS `NumCPUs`,\
        				`DailyView`.`MemoryGB` AS `MemoryGB`,\
        				`DailyView`.`DefaultIp` AS `DefaultIp`,\
        				`DailyView`.`SystemName` AS `Systemname`,\
        				`DailyView`.`DataCenter` AS `DataCenter`,\
        				`DailyView`.`Status` AS `Status`,\
        				COUNT(DISTINCT `DailyView`.`datetime`) AS `Number_of_Days_CPU`,\
        				ROUND(((SUM(`DailyView`.`cpu_25`) / SUM(`DailyView`.`cputotal`)) * 100), 2) AS `CPU_LESSTHAN25`,\
        				ROUND(((SUM(`DailyView`.`cpu_75`) / SUM(`DailyView`.`cputotal`)) * 100),2) AS `CPU_BETWEEN25TO75`,\
        				ROUND(((SUM(`DailyView`.`cpu_100`) / SUM(`DailyView`.`cputotal`)) * 100), 2) AS `CPU_MORETHAN75`,\
        				ROUND(AVG(`DailyView`.`cpu_avg`), 2) AS `CPU_Avg`,\
        				ROUND(MAX(`DailyView`.`cpu_max`), 2) AS `CPU_Max`,\
        				ROUND(MAX(`DailyView`.`cpu_min`), 2) AS `CPU_Min`,\
        				ROUND(((SUM(`DailyView`.`mem_25`) / SUM(`DailyView`.`mem_total`)) * 100), 2) AS `Mem_LESSTHAN_25`,\
        				ROUND(((SUM(`DailyView`.`mem_75`) / SUM(`DailyView`.`mem_total`)) * 100), 2) AS `Mem_BETWEEN25TO75`,\
        				ROUND(((SUM(`DailyView`.`mem_100`) / SUM(`DailyView`.`mem_total`)) * 100), 2) AS `Mem_MORETHAN75`,\
        				ROUND((AVG(`DailyView`.`mem_avg`) * 100), 2) AS `Mem_Avg`,\
        				ROUND((MAX(`DailyView`.`mem_max`) * 100), 2) AS `Mem_Max`,\
        				ROUND((MAX(`DailyView`.`mem_min`) * 100), 2) AS `Mem_Min`,\
        				ROUND(AVG(`DailyView`.`disk_avg`), 0) AS `Disk_Avg`,\
        				ROUND(MAX(`DailyView`.`disk_max`), 0) AS `Disk_Max`,\
        				ROUND(MIN(`DailyView`.`disk_min`), 0) AS `Disk_Min`,\
        				SUM(IF(ISNULL(`DailyView`.`disk_avg`), 0, 1)) AS `Number_of_days_DISK`,\
        				((SUM(IFNULL(`DailyView`.`disk_avg`, 0)) * 288) * 300) AS `Accumulate_DISK`,\
        				ROUND(AVG(`DailyView`.`network_avg`), 0) AS `Network_Avg`,\
        				ROUND(MAX(`DailyView`.`network_max`), 0) AS `Network_Max`,\
        				ROUND(MIN(`DailyView`.`network_min`), 0) AS `Network_Min`,\
        				SUM(IF(ISNULL(`DailyView`.`network_avg`), 0, 1)) AS `Number_of_days_NETWORK`,\
        				((SUM(IFNULL(`DailyView`.`network_avg`, 0)) * 288) * 300) AS `Accumulate_NETWORK`\
    					FROM \
        					`DailyView`\
    					WHERE "
    					+ condition +
    					" GROUP BY `DailyView`.`Name`;";
        database.queryDatabase(sql_query, function(err, data){
        if (err) {
            res.send(err);
            res.end();
        } else {
            console.log(data);
            res.send(data);
            res.end();
        }

    });
});

router.get('/lastupdatedate', function(req, res, next){
    var sql_query = "select datetime from DailyCPU order by datetime desc limit 1;"
    database.queryDatabase(sql_query, function(err, data){
        if (err) {
            res.send(err);
            res.end();
        } else {
            try{
                res.send(data[0]);
                res.end();  
            } catch(e) {
                res.send('data parse error');
                res.end();
            }
        }

    });
});



module.exports = router;
