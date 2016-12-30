var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'dcs-ur.chj9ssjelak2.us-west-2.rds.amazonaws.com',
  user     : 'dcsur',
  password : 'icd9#Rxyz',
  database : 'report'
});

connection.connect(function(err){
	 if(err){
	 	console.log(err);
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

connection.query('select * from DailyView limit 5;', function(err, rows, fields) {
  if (err) throw err;
  var string = JSON.stringify(rows[0]);
  var json =  JSON.parse(string);
  console.log('The solution is: ', json);
});

connection.end();