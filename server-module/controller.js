var express = require("express");
var path = require("path");
var fs = require("fs");

var router = express.Router();

/* Utility functions */
const padStart = (value) => {
  const v = value.toString();
  return v.length < 2 ? v.padStart(2, "0") : v;
};

const getYearAndMonth = (date, addDay = false) => {
  const t = new Date(date);
  const d = addDay ? "-" + padStart(t.getDate()) : "";
  return t.getFullYear() + "-" + padStart(t.getMonth() + 1) + d;
};

module.exports = function (app) {
  const controller = {};
  const Logger = app.Logger;
  const logInfo = (message) => Logger.info(`\t ${message}`);
  const DB = app.DB;
  //const reportAppConfig = app.reportAppConfig;
  const {
    APP_GROUP_EMAIL2,
    APP_NAME,
    APP_DEVELOPER,
    APP_ISPRODUCTION,
    APP_DEVELOPMENT_EMAIL,
    APP_SERVER_PORT,
    APP_CLIENT_PORT,
  } = process.env;

  const appConfig = {
    name: APP_NAME,
    developer: APP_DEVELOPER,
    "project-summary":
      "Nodejs app with Reactjs framework and postgresql database.",
    isProduction: APP_ISPRODUCTION,
    productionEmail: "",
    testEmail: APP_DEVELOPMENT_EMAIL,
    port: {
      server: APP_SERVER_PORT,
      client: APP_CLIENT_PORT,
    },
  };

  /* pageSize= 100   pageCount= n */
  controller.getTransfer = async (req, res, next) => {
    logInfo("Calling getTransfer");
    const result = {};
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;
    const bankcode = req.query.bankcode;
    const bankCodeExist = req.query.bankcode ? true : false;
    const date = req.query.date;
    const dateExist = req.query.date ? true : false;
    //console.log(limit, skip, date);
    let allTransfers = null;
    let allTransfersValues = null;

    /*
        const allTransfers = bankCodeExist?
        'select * from switch.transfers where requesttime >= current_date and sourcebank != $1 and destbank=$2 order by requesttime desc limit $3 offset $4 ;'
        :'select * from switch.transfers where requesttime >= current_date and sourcebank != $1 order by requesttime desc limit $2 offset $3 ;';
        const allTransfersValues = 
        bankCodeExist?
        ['700',bankcode, limit, skip]
        :['700', limit, skip];
        */
    Logger.warn("Exists::: ", bankCodeExist, dateExist);
    if (bankCodeExist && dateExist) {
      allTransfers = `select * from switch.transfers where to_char(requesttime, 'YYYY-MM-DD') = ${date} and sourcebank != $1 and destbank='${bankcode}' order by requesttime desc limit $2 offset $3 ;`;
      allTransfersValues = ["700", limit, skip];
    } else if (bankCodeExist) {
      allTransfers =
        "select * from switch.transfers where requesttime >= current_date and sourcebank != $1 and destbank=$2 order by requesttime desc limit $3 offset $4 ;";
      allTransfersValues = ["700", bankcode, limit, skip];
    } else if (dateExist) {
      allTransfers =
        "select * from switch.transfers where to_char(requesttime, 'YYYY-MM-DD') = " +
        date +
        "  and sourcebank != $1 order by requesttime desc limit $2 offset $3 ;";
      allTransfersValues = ["700", limit, skip];
    } else {
      allTransfers =
        "select * from switch.transfers where requesttime >= current_date and sourcebank != $1 order by requesttime desc limit $2 offset $3 ;";
      allTransfersValues = ["700", limit, skip];
    }

    Logger.warn("Query::: ", allTransfers, allTransfersValues);

    try {
      let result = await DB.makeQueryRequest(allTransfers, allTransfersValues);
      let logMessage = {
        message: "Successful",
        count: result.rowCount,
      };
      console.log(logMessage);
      Logger.info(logMessage);

      res.json({
        message: "Successful",
        data: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      Logger.error({ message: error.message, error: error.name });
      res.json({ message: error.message, error: error.name });
    }
  };

  /* pageSize= 100   pageCount= n */
  controller.getAgencytransfer = async (req, res, next) => {
    logInfo("Calling getAgencytransfer");
    console.log("Calling getAgencytransfer");
    const result = {};
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;
    const bankcode = req.query.bankcode;
    const bankCodeExist = req.query.bankcode ? true : false;
    const date = req.query.date;
    const dateExist = req.query.date ? true : false;

    if (bankCodeExist) {
      agencyTransfers =
        "select * from switch.transfers where requesttime >= current_date and sourcebank = $1 and destbank=$2 order by requesttime desc limit $3 offset $4 ;";
      agencyTransfersValues = ["700", bankcode, limit, skip];
    } else if (dateExist) {
      agencyTransfers = `select * from switch.transfers where to_char(requesttime, 'YYYY-MM-DD') = ${date} and sourcebank = $1 order by requesttime desc limit $2 offset $3 ;`;

      agencyTransfersValues = ["700", limit, skip];
    } else {
      agencyTransfers =
        "select * from switch.transfers where requesttime >= current_date and sourcebank = $1 order by requesttime desc limit $2 offset $3 ;";
      agencyTransfersValues = ["700", limit, skip];
    }

    console.log("Query:::: ", agencyTransfers);

    try {
      let result = await DB.makeQueryRequest(
        agencyTransfers,
        agencyTransfersValues
      );
      let logMessage = {
        message: "Successful",
        count: result.rowCount,
      };
      console.log(logMessage);
      Logger.info(logMessage);
      res.json({
        message: "Successful",
        data: result.rows,
        count: result.rowCount,
        statuscode: 200,
      });
    } catch (error) {
      Logger.error({ message: error.message, error: error.name });
      console.error({ message: error.message, error: error.name });
      res.json({ statuscode: 500, message: error.message, error: error.name });
    }
  };

  controller.getQueryByID = async (req, res, next) => {
    logInfo("Calling getQueryByID");
    const result = {};
    // const limit = parseInt(req.query.limit) || 100;
    // const skip = parseInt(req.query.skip) || 0;
    const requestid = req.query.requestid;
    const reference = req.query.reference;
    const referenceExist = reference ? true : false;
    //console.log(limit, skip);

    const queryByID = referenceExist
      ? "select * from switch.transfers where reference=$1 ;"
      : "select * from switch.transfers where requestid = $1 ;";
    const queryByIDValues = referenceExist ? [reference] : [requestid];

    try {
      let result = await DB.makeQueryRequest(queryByID, queryByIDValues);
      let logMessage = {
        message: "Successful",
        count: result.rowCount,
      };
      console.log(logMessage);
      Logger.info(logMessage);
      res.json({
        message: "Successful",
        data: result.rows,
        count: result.rowCount,
        statuscode: 200,
      });
    } catch (error) {
      Logger.error({ message: error.message, error: error.name });
      res.json({ statuscode: 500, message: error.message, error: error.name });
    }
  };

  controller.getDailySummary = async (req, res, next) => {
    logInfo("Calling getDatedTransferSummary");

    const result = {};
    // const limit = parseInt(req.query.limit) || 100;
    // const skip = parseInt(req.query.skip) || 0;
    let targetDate = req.query.date || new Date();
    targetDate = getYearAndMonth(targetDate, true);
    if (targetDate === null) {
      throw new Error("Date to query not provided!");
      return;
    }
    console.log(targetDate);
    Logger.info(targetDate);

    const dailySummary = `select t.day, t.route, t.destbank, approved, count(t.amount), sum(t.amount) from
        (select to_char(requesttime, 'YYYY-MM-DD') "day", amount, destbank, case approved when true then 'Approved' else 'Declined' end "approved", route from switch.transfers where sourcebank != $1 and batchid is null
            and to_char(requesttime, 'YYYY-MM-DD') = $2
        )
        t group by t.day, t.route, t.destbank, t.approved order by t.day desc;`;
    const dailySummaryValues = ["700", targetDate];

    try {
      let result = await DB.makeQueryRequest(dailySummary, dailySummaryValues);
      let logMessage = {
        message: "Successful",
        count: result.rowCount,
      };
      console.log(logMessage);
      Logger.info(logMessage);
      res.json({
        message: "Successful",
        data: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      Logger.error({ message: error.message, error: error.name });
      res.json({ message: error.message, error: error.name });
    }
  };

  controller.getMonthlyTransferSummary = async (req, res, next) => {
    logInfo("Calling getMonthlyTransferSummary");

    const result = {};
    // const limit = parseInt(req.query.limit) || 100;
    // const skip = parseInt(req.query.skip) || 0;
    let targetDate = req.query.date || new Date();
    targetDate = getYearAndMonth(targetDate);

    if (targetDate === null) {
      throw new Error("Date to query not provided!");
      return;
    }
    console.log("getMonthlyTransferSummary: ", targetDate);
    Logger.info("getMonthlyTransferSummary: ", targetDate);

    const dailySummary = `select t.day, t.route, t.destbank, approved, count(t.amount), sum(t.amount) from
        (select to_char(requesttime, 'YYYY-MM-DD') "day", amount, destbank, case approved when true then 'Approved' else 'Declined' end "approved", route from switch.transfers where sourcebank != $1 and batchid is null
            and to_char(requesttime, 'YYYY-MM') = $2
        )
        t group by t.day, t.route, t.destbank, t.approved order by t.day desc;`;
    const dailySummaryValues = ["700", targetDate];

    try {
      let result = await DB.makeQueryRequest(dailySummary, dailySummaryValues);
      let logMessage = {
        message: "Successful",
        count: result.rowCount,
      };
      console.log(logMessage);
      Logger.info(logMessage);
      res.json({
        message: "Successful",
        data: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      Logger.error({ message: error.message, error: error.name });
      res.json({ message: error.message, error: error.name });
    }
  };

  controller.getDailySummaryCountnVolume = async (req, res, next) => {
    logInfo("Calling getDailySummary");

    const result = {};
    let targetDate = req.query.date || new Date();
    targetDate = getYearAndMonth(targetDate, true);

    // const limit = parseInt(req.query.limit) || 100;
    // const skip = parseInt(req.query.skip) || 0;
    console.log("targetDate::", targetDate);

    const dailySummary = `select 
            to_char(t.requesttime, 'YYYY-MM-DD') "Day", 
            (case t.sourcebank when '909' then 'ATM' when '501' then 'PayAttitude' end) "SourceBank",
            (case t.destbank when '044' then 'ACCESS BANK NIGERIA' when '082' then 'KEYSTONE BANK' when '023' then 'CITIBANK NIGERIA'when '063' then 'DIAMOND BANK' when '050' then 'ECOBANK' when '214' then 'FCMB' when '070' then 'FIDELITY BANK'when '011' then 'FIRST BANK OF NIGERIA' when '058' then 'GTBANK' when '030' then 'HERITAGE BANK' when '048' then 'JAIZ BANK'when '076' then 'POLARIS BANK' when '221' then 'STANBIC IBTC' when '068' then 'STANDARD CHARTERED' when '232' then 'STERLING BANK' when '032' then 'UNION BANK' when '033' then 'UNITED BANK FOR AFRICA' when '215' then 'UNITY BANK' when '035' then 'WEMA BANK' when '057' then 'ZENITH BANK' when '501' then 'PayAttitude' else 'Undefined' end) "DestBank",
            t.destbank "BankCode", t.route "Route",t.approved "Approved",
            (case  when (t.route='NIP' or (t.approved and t.reversed)) then false when (lower(t.route)='direct' and not t.approved and t.reversed) then true else false end) "Reversed"
            , count(t.approved) "Count", 
            (case when (not t.approved and (case  when (t.route='NIP' or (t.approved and t.reversed)) then false when (lower(t.route)='direct' and not t.approved and t.reversed) then true else false end) ) then count(t.approved) else 0 end) "ReversedCount", sum(t.amount) "Value" 
            from 
            (
            select 
            sourcebank, destbank, requesttime, route,reversible,approved,reversed,(reversible and not approved and reversed ) "isReversed", amount from switch.transfers 
            where to_char(requesttime, 'YYYY-MM-DD') = $1 and batchid is null and sourcebank !='700'
            order by requesttime desc, destbank, sourcebank
            )
            as t 
            group by "Day", t.route,t.destbank,t.sourcebank,t.approved,t.reversed, "isReversed";`;
    const dailySummaryValues = [targetDate];

    try {
      let result = await DB.makeQueryRequest(dailySummary, dailySummaryValues);
      let logMessage = {
        message: "Successful",
        count: result.rowCount,
      };
      console.log(logMessage);
      Logger.info(logMessage);
      res.json({
        message: "Successful",
        data: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      Logger.error({ message: error.message, error: error.name });
      res.json({ message: error.message, error: error.name });
    }
  };

  controller.getConfig = (req, res, next) => {
    res.status(200).json({ message: "Success", data: appConfig });
  };

  return controller;
};
