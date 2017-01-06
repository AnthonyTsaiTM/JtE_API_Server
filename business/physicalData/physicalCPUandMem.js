const moment = require('moment');


const physicalCPUandMemDAO = require('../../dataAccess/physicalData/physicalCPUandMemDAO');


const fetchCPUandMemInfos = (req, callback) =>{
  const conditions = handleInputCondtions(req.body);

  physicalCPUandMemDAO.fetchCPUandMemInfos(conditions,callback);

}

const handleInputCondtions = (reqBody) =>{
  let conditions = {};
  conditions.systemnames  = reqBody['system_names'];
  conditions.statuses = reqBody['statuses'];
  conditions.datacenters = reqBody['datacenters'];
  conditions.startdate = moment(reqBody['start_date']).format('YYYY-MM-DD','YYYY-MM-DD');
  conditions.enddate = moment(reqBody['end_date']).format('YYYY-MM-DD','YYYY-MM-DD');
  return conditions;
}

module.exports = {fetchCPUandMemInfos};
