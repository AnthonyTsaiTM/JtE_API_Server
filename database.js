var mysql = require('mysql');
var config = require('./config');
module.exports = {
	queryDatabase : function(sql_query, callback){
		var connection = mysql.createConnection(config.params);
	    connection.connect(function(err){
	        if(err){
		            console.log(err);
		            console.log('Error connecting to Db');
		            callback(err, null);
		        }
		    });
		    connection.query(sql_query, function(err, rows, fields) {
		        if (err) res.send(err.toString());
		        var string = JSON.stringify(rows);
		        var data =  JSON.parse(string);
		        connection.end();
		        callback(null, data);
		    });
	}
}


