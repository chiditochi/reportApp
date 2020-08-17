var express = require('express');
var router = express.Router();


module.exports = function(app){
    const Controller = require('./controller')(app);

    router.get('/transfer', Controller.getTransfer);
    router.get('/agencyTransfer', Controller.getAgencytransfer);
    router.get('/queryByID', Controller.getQueryByID)

    router.get('/dailyTransferSummary', Controller.getDailySummary);
    router.get('/monthlyTransferSummary', Controller.getMonthlyTransferSummary)
    
    router.get('/dailySummaryCountnVolume', Controller.getDailySummaryCountnVolume)
    //router.post('/transfer', Controller.transfer);
    // router.get('/saveTransferData', Controller.saveTransferData)
    // router.get('/saveAgencyTransferData', Controller.saveAgencyTransferData)

    return router;
};
