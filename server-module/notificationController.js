
module.exports = function(app){
    const controller = {};
    const Logger = app.Logger;
    const logInfo = (message)=>Logger.info(`\t ${message}`)
    const DB = app.DB;
    const reportAppConfig = app.reportAppConfig;
   
}