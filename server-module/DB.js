const { Client } = require("pg");
//const reportAppConfig = require('../app-config.json');

module.exports = function (app) {
  const Logger = app.Logger;
  let ReportAppDB = null;
  const {
    APP_ISPRODUCTION,
    APP_DEVDB_CONNECTIONSTRING,
    APP_HOMEDB_CONNECTIONSTRING,
    APP_PRODDB_CONNECTIONSTRING,
  } = process.env;

  //dev == 1, production = 2, homedev == 3
  const isProduction = APP_ISPRODUCTION;

  /* 1=dev; 2=prod; 3=homDev */
  switch (isProduction) {
    case 1:
      ReportAppDB = APP_DEVDB_CONNECTIONSTRING;
      break;
    case 2:
      ReportAppDB = APP_PRODDB_CONNECTIONSTRING;
      break;
    default:
      ReportAppDB = APP_HOMEDB_CONNECTIONSTRING;
      break;
  }

  const DB = {};

  const getConnection = () => {
    const connection = new Client({ connectionString: ReportAppDB });
    //const connection = new Client(ReportAppDB.config);
    return connection;
  };

  DB.makeQueryRequest = async (query, values) => {
    let client = getConnection();
    client.connect();
    const result = await client.query(query, values);
    client.end();
    return Promise.resolve(result);
  };

  Logger.log(
    isProduction == true
      ? "Production DB"
      : "Test DB" + " query methods attached ..."
  );
  app.DB = DB;
};
