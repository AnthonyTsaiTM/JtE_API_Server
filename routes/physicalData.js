
const express = require('express');
const router = express.Router();
const physicalCPUandMemService = require('../business/physicalData/physicalCPUandMem');



router.post('/reportviewPhysicalCPUandMem',(req,res,next)=>{
    console.log(req.body);
    let responseData;
    physicalCPUandMemService.fetchCPUandMemInfos(req,(data)=>{
      responseData = data;
      res.send(responseData);
      res.end();
    });

});

module.exports = router;
