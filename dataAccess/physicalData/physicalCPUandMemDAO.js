const mysql = require('mysql');
const config = require('../../config');
const database = require('../../database');



const fetchCPUandMemInfos = function(conditions, callback) {

  let dateTimeConditionString = `(cpu.DATETIME BETWEEN '${conditions.startdate}' AND '${conditions.enddate}') AND 1=1`;
  let systemNamesConditionString = getConditionString(conditions.systemnames,'SYSTEMNAME');
  let statusesConditionString = getConditionString(conditions.statuses,'STATUS');
  let datacentersConditionString = getConditionString(conditions.datacenters,'DATACENTER');
  let queryString = makeQueryString(dateTimeConditionString,systemNamesConditionString,statusesConditionString,datacentersConditionString);
  fetchDataFromDB(queryString,callback);

}

const getConditionString = function(names, queryName) {
  console.log(names);
  return names.length == 0 || names.length == undefined? '' : `AND ${queryName} IN (` + names.map(function(n){return "'" + n + "'";}).join(',') + `)`;
}
const makeQueryString = function(datetime,systemnames,statuses,datacenters) {

  let queryString = `SELECT
ID,MEMORYGB,HYPERVISORID,HOSTSTATUS,DATACENTER,DEFAULTIP,OS,STORAGETYPE,STATUS,SYSTEMNAME,
FQDN,cpu.PHYSICALNAME,
COUNT(DISTINCT cpu.DATETIME) as Number_of_Days_CPU,
ROUND((SUM(CPU_25)/SUM(cpu.TOTAL)) * 100,2) as CPU_LESSTHAN25,
ROUND((SUM(CPU_75)/SUM(cpu.TOTAL)) * 100,2) as CPU_BETWEEN25TO75,
ROUND((SUM(CPU_100)/SUM(cpu.TOTAL)) * 100,2) as CPU_MORETHAN75,
ROUND(MIN(cpu.MIN),2) as CPU_MIN,
ROUND(MAX(cpu.MAX), 2) AS CPU_MAX,
ROUND(AVG(cpu.AVG), 2) AS CPU_AVG,

ROUND(((SUM(MEM_25) / SUM(mem.TOTAL))) * 100, 2) AS Mem_LESSTHAN_25,
ROUND(((SUM(MEM_75) / SUM(mem.TOTAL))) * 100, 2) AS Mem_BETWEEN25TO75,
ROUND(((SUM(MEM_100) / SUM(mem.TOTAL)) * 100), 2) AS Mem_MORETHAN75,

ROUND((AVG(mem.AVG)), 2) AS MEM_AVG,
ROUND((MAX(mem.MAX)), 2) AS MEM_MAX,
ROUND((MIN(mem.MIN)), 2) AS MEM_MIN


  FROM PhysicalDailyCPU cpu, PhysicalDailyMem mem,PhysicalInfo info
  WHERE cpu.PHYSICALNAME = mem.PHYSICALNAME
  AND cpu.PHYSICALNAME = info.FQDN
  AND mem.PHYSICALNAME = info.FQDN
  AND mem.DATETIME = cpu.DATETIME
  AND ${datetime}
  ${systemnames}
  ${statuses}
  ${datacenters}
  GROUP BY PHYSICALNAME`;

return queryString;
}

const fetchDataFromDB = function (queryString, callback) {
    database.queryDatabase(queryString, function(err, data){
        if (err){
            console.log(err);
            return err;
        }else{
            console.log(data);
            callback(data);
        }
      });
}

module.exports = {fetchCPUandMemInfos};
