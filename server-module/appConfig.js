//const email = require("emailjs");
const moment = require("moment");
const services = require("./services");

const DB = require("./DB");
const routes = require("./routes");

module.exports = function (app) {
  const Logger = app.Logger;
  const reportAppConfig = app.reportAppConfig;

  const { APP_GROUP_EMAIL2 } = process.env;

  //add database
  DB(app);

  //add app route
  app.use("/api", routes(app));

  //get app services for logic processing
  const appServices = services(app);

  //add notification service | Main Processor
  const transferNotification = async function () {
    const processingDate = new Date();
    const displayDT = moment().format("LLLL");
    const queryDT = moment().format("YYYY-MM-DD");
    const hourlyQueryDT = moment().format("YYYY-MM-DD HH:mm:ss");
    //const prodhourlyQueryDT = moment().format("YYYY-MM-DD HH:mm:ss")
    const MinuteHQueryDT = moment().format("YYYY-MM-DD HH:mm");
    const noTransPeriod = reportAppConfig.noTransactionNotificationPeriod;
    const recipients = APP_GROUP_EMAIL2;
    const dailyPeriodicEndDate = moment()
      .startOf("day")
      .add(noTransPeriod, "h")
      .format("YYYY-MM-DD HH:mm:ss");

    //No transaction processor
    async function processNoTransaction() {
      const r = await appServices.queryForNoTransaction();
      if (r.count) {
        const bankCodes = r.data.map((v) => v.destbank);
        //replace bankcodes with bank names
        const bankNames = bankCodes.map((v) => appServices.getBankDetails(v));
        try {
          const template = appServices.getMessageTemplate(
            processingDate,
            bankNames,
            false
          );
          const emailMessage = appServices.getMessage(
            `No Transaction Notification`,
            recipients,
            template,
            null
          );
          await appServices
            .sendEmail(emailMessage)
            .catch((e) => console.log(e));
        } catch (e) {
          console.error(e);
          Logger.info(e);
        }
      } else {
        const errorM = `${MinuteHQueryDT} cycle; \t NO cycle to process`;
        console.log(errorM);
        Logger.info(errorM);
      }
    }

    //Priority processor
    async function processPriority(cyclesToProcess) {
      try {
        let d = await Promise.all(
          //change let d to const d in prod
          cyclesToProcess.map(
            async (v) =>
              await appServices.queryForPriority(appServices.getCycle(v))
          )
        );
        let doProcess = false;
        d = {
          "058": true,
          "033": true,
          "057": false,
          "044": false,
          "011": false,
        }; //remove in production
        if (Object.values(d).includes(true)) doProcess = true;
        if (doProcess) {
          const dataToProcess = Object.entries(d).filter((x) => x[1] === true);
          const bankCodes = dataToProcess.map((x) => x[0]);
          //replace bankcodes with bank names
          const bankNames = bankCodes.map((v) => appServices.getBankDetails(v));
          const template = appServices.getMessageTemplate(
            processingDate,
            bankNames,
            true
          );
          const emailMessage = appServices.getMessage(
            `Failed Transactions Notification`,
            recipients,
            template,
            null
          );
          await appServices
            .sendEmail(emailMessage)
            .catch((e) => console.log(e));
        } else {
          const errorM = `${MinuteHQueryDT} cycle; ${cyclesToProcess} processed; ${
            doProcess ? "Email sent!" : "No Email sent!"
          }`;
          console.log(errorM);
          Logger.info(errorM);
        }
      } catch (e) {
        console.error(e);
        Logger.info(e);
      }
      //const pr = await appServices.getProcessQuery(dataToProcess);
    }

    //let this match be based on minutes precision
    if (hourlyQueryDT === dailyPeriodicEndDate || true) {
      //await processNoTransaction();
    }

    const cyclesToProcess = appServices.getMinuteCycle();
    if (true || (appServices.isWithinCutOffTime() && cyclesToProcess.length)) {
      //await processPriority(cyclesToProcess); //production
      //await processPriority(["one"]); //test
    }
  };

  setInterval(function () {
    //notification logic goes here
    transferNotification(services);
  }, 20 * 1000);
};
