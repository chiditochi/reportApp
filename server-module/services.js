module.exports = function (app) {
  const email = require("emailjs");
  const moment = require("moment");
  const asyncLib = require("async");

  const services = {};
  const Logger = app.Logger;
  const logInfo = (message) => Logger.info(`\t ${message}`);
  const DB = app.DB;
  const reportAppConfig = app.reportAppConfig;

  const {
    APP_EMAIL_USER,
    APP_EMAIL_PASSWORD,
    APP_EMAIL_HOST,
    APP_EMAIL_PORT,
    APP_EMAIL_SSL,
    APP_EMAIL_TIMEOUT,
  } = process.env;

  const emailConfig = {
    user: APP_EMAIL_USER,
    password: APP_EMAIL_PASSWORD,
    host: APP_EMAIL_HOST,
    port: APP_EMAIL_PORT,
    ssl: APP_EMAIL_SSL,
    timeout: APP_EMAIL_TIMEOUT,
  };

  services.getBankDetails = (find) => {
    const d = {
      "058": "GTB",
      "082": "KEYSTONE",
      "044": "ACCESS",
      "070": "FIDELITY",
      "215": "UNITY",
      "221": "STANBIC",
      "214": "FCMB",
      "050": "ECOBANK",
      "301": "JAIZ",
      "011": "FBN",
      "076": "POLARIS",
      "035": "WEMA",
      "033": "UBA",
      "057": "ZENITH",
      "232": "STERLING",
      "030": "HERITAGE",
      "068": "SCB",
      "102": "Titan",
      "103": "Globus",
      "063": "DBN Access",
      "501": "PayAttitude",
    };
    const result = !find ? d : d[find] ? d[find] : find;

    return result;
  };

  services.sendEmail = async function (message) {
    try {
      const setupConfig = emailConfig;
      console.log(setupConfig, message);
      return new Promise(function (res, rej) {
        const server = email.server.connect(setupConfig);
        server.send(message, function (e, m) {
          if (e) rej({ status: "Error", error: "Error sending email!" });
          else res({ message: m || "Email was sent", status: "Success" });
        });
      });
    } catch (e) {
      throw e.message;
    }
  };

  //get message template for priority task or whole day check
  services.getMessageTemplate = function (date, banks, isPriority = true) {
    if (isPriority) {
      return `
        Dear Ecommerce,
        \tReport for ${moment(date).format("LLLL")}
        Please note that the last 10 transactions for banks: \n\t\t${banks.toString()} ${
        banks.length < 2 ? "has" : "have"
      } failed
        Confirm all is well
    
        Kind regards
        \t(powered by eCommerce D & O)
        `;
    } else {
      return `
        Dear Ecommerce,
        \tReport for ${moment(date).format("LLLL")}
        Please note that the bank(s): \n\t${banks.toString()} ${
        banks.length < 2 ? "has" : "have"
      } not registered a transaction today
        Confirm all is well

        Kind regards
        \t(powered by eCommerce D & O)
    `;
    }
  };

  //get prepared mail message to be sent to recipients
  services.getMessage = function (subject, to, message, attachment) {
    //subject, to, message are required
    const m = { ...reportAppConfig.emailMessage };
    if (
      (!subject && !subject.length) ||
      (!to && !to.length) ||
      (!message && !message.length)
    ) {
      console.log("getMessage:: A required field was not included");
      Logger.info("getMessage:: A required field was not included");
      throw {
        error: "subject|to|message are required!",
        message: "A required field was not included",
      };
    } else {
      m.text = message;
      m.subject = subject;
      m.to = to;
      //m.from = from?from:m.from;
      //m.cc = to;
      const a =
        attachment && attachment.length
          ? {
              ...m.attachment,
              path: attachment.path,
              type: attachment.type,
              name: attachment.name,
            }
          : null;
      m.attachment = a || [];
      //console.log("getMessage:: ", m);
    }
    return m;
  };

  //const isWithinCutOffTime cutoff time for app: 6:am to 10pm
  services.isWithinCutOffTime = function () {
    const hr = Number(moment().format("HH"));
    //console.log(hr)
    let result = false;
    result = hr >= 6 && hr < 23 ? true : false;
    return result;
  };

  //get cycles to process
  services.getMinuteCycle = function () {
    const minute = moment().format("mm");
    const out =
      minute === "15"
        ? ["one"]
        : minute === "30"
        ? ["one", "two"]
        : minute === "00"
        ? ["one", "two", "three"]
        : [];
    return out;
  };

  //get cycle object from serverConfig.json
  services.getCycle = function (cycleKey) {
    const priority = reportAppConfig.priority;
    return priority[cycleKey];
  };

  //make database request to obtain query result
  const makeRequest = async (DB, query, values) => {
    const r = await DB.makeQueryRequest(query, values);
    return r;
  };

  //Queries database for result further processed for email notification
  services.queryForPriority = async function (priorityObj) {
    const countLimit = reportAppConfig.transferFailureCount;
    const m = `Processing ${priorityObj.cycle} minutes cycle @${moment().format(
      "MMMM Do YYYY, HH:mm:ss a"
    )}`;
    Logger.info("\tservices.queryService: ", m);
    console.log("\tservices.queryService: ", m);

    const banks = priorityObj.banks.split(",");
    const oneHourAgo = moment().subtract("1", "hour").format("YYYY-MM-DD HH");

    let resultMessage = {};

    return new Promise(function (res, rej) {
      return asyncLib.each(
        banks,
        function (bank, cb) {
          let query =
            "select * from switch.transfers where to_char(requesttime, 'YYYY-MM-DD HH') >= '";
          query +=
            oneHourAgo +
            "' and destbank = '" +
            bank +
            "' and approved = false and sourcebank='909'";
          query += " order by requesttime desc fetch first 10 rows only;";
          //console.log("\tquery:: ", query);
          const values = [];
          let message = [];
          makeRequest(DB, query, values).then(function (r) {
            resultMessage[bank] =
              (r && r.rowCount) >= countLimit ? true : false;
            // console.log("query::result ", resultMessage);
            cb(null);
          });
        },
        function (err) {
          if (err) {
            console.log("Error:", err.message);
            Logger.info(err.message);
            rej({ error: err, message: "Error fetching data!" });
          }
          console.log("services.queryService.result:  ", resultMessage);
          Logger.info(resultMessage);
          res({
            message: "Successfully fetched data",
            data: resultMessage,
          });
        }
      );
    });
  };

  services.queryForNoTransaction = async function () {
    //startDate = '2020-01-03 00' | endDate = '2020-01-03 12' |
    const noTransPeriod = reportAppConfig.noTransactionNotificationPeriod;
    const startDate = moment().startOf("day").format("YYYY-MM-DD HH");
    const endDate = moment()
      .startOf("day")
      .add(noTransPeriod, "h")
      .format("YYYY-MM-DD HH");
    const query = `
    select 
	distinct destbank  
	from switch.transfers t
     where requesttime >= current_date-2  
	 t.destbank not in (
     select 
    	distinct destbank  
	 from switch.transfers 
	 where 
		 to_char(requesttime, 'YYYY-MM-DD HH') > '${startDate}' 
		 and to_char(requesttime, 'YYYY-MM-DD HH') <= '${endDate}' 
     );
    `;
    const testQuery = `
    select 
	distinct destbank  
	from switch.transfers t
     where 
     --requesttime >= current_date-2  
	 t.destbank not in (
     select 
    	distinct destbank  
	 from switch.transfers 
	 where 
		 to_char(requesttime, 'YYYY-MM-DD HH') > '${startDate}'  
		 and to_char(requesttime, 'YYYY-MM-DD HH') <= '${endDate}' 
     );
    `;

    try {
      const r = await DB.makeQueryRequest(testQuery, []);
      const result = {
        message: "Successful",
        data: r.rows,
        count: r.rowCount,
      };
      console.log(`${result.message} with ${result.count} rows`);
      Logger.info(`${result.message} with ${result.count} rows`);
      return result;
    } catch (e) {
      const eResult = {
        message: `Error! ${e.message}`,
        data: null,
        count: null,
      };
      console.log(`${result.message}`);
      Logger.info(`${result.message}`);
      return eResult;
    }
    return r;
  };

  //service to send email with the template for notification purpose
  /*
  services.getProcessQuery = function(resultObj) {
    //{ bank: sendEmail }
    console.log("resultObj::", resultObj);
  };
  */

  //app.Services = services;
  return services;
};
