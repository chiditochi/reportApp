/* This module supplies configuration  */

const Config = {
  appTimer: {
    timeApp: 1000,
    transfer: 60000,
    agency: 600000,
    summary: 1000 * 60 * 10,
  },
  tranferColumn: {
    uid: "density",
    label: "Density",
    minWidth: 50,
    align: "right",
  },
  transferFields: "requestid,requesttime,sourcebank,destbank,route,accountno,amount,responsetime,statuscode,statusmessage,approved,requerycount,reversed,reversible,reference".split(
    ","
  ),
  summaryFields: "Day,SourceBank,DestBank,BankCode,Route,Approved,Reversed,Count,ReversedCount,Value".split(
    ","
  ),
};

module.exports = Config;
