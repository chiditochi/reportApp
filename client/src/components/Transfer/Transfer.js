import React, { useState, useEffect } from "react";
import Config from "../../services/config";
import Utility from "../../services/utility";
import Loading from "../App/Loading";
import TransferTable from "../Transfer/TransferTable";
//import moment from mome;

function Transfer() {
  //const styles = {};
  const [records, setRecord] = useState({ data: [], count: 0, bankData: [] });
  const [display, setDisplay] = useState(false);
  const [useStorage, setUseStorage] = useState(false);
  const handleSetters = {};
  const [selectedDate, setSelectedDate] = React.useState(null);
  handleSetters["setSelectedDate"] = setSelectedDate;
  const [selectedBank, setSelectedBank] = React.useState("All");
  handleSetters["setSelectedBank"] = setSelectedBank;
  const [bankData, setBankData] = React.useState(null);
  const [infoMessage, setInfoMessage] = React.useState("Summary for Today");
  const [sessionName, setSessionName] = React.useState("transfer");

  async function getTransfer(url) {
    setDisplay(true);
    const r = await Utility.getTransfer(url);
    //console.log("Result:: ", r, url);
    if (r.data && r.data.length) {
      const bankCodeList = r.data && Utility.getBanks(r.data);
      setBankData(bankCodeList);
      setRecord((prev) => ({
        ...prev,
        data: r.data,
        count: r.count,
        bankData: bankCodeList,
      }));
    } else {
      const targetBank =
        selectedBank.toLowerCase() === "all"
          ? "All"
          : Utility.getBankDetails(selectedBank);
      setInfoMessage(targetBank + " Transfer has No result!");
      //the result table should be set to empty table component.
      //also the display time should reflect the currently selected time
      const bankCodeList = null;
      setBankData(bankCodeList);
      setRecord((prev) => ({
        ...prev,
        data: [],
        count: 0,
        bankData: bankCodeList,
      }));
    }
    setDisplay(false);
  }

  const timedFetch = (selectedBank) => {
    //console.log("selectedBank3: ", selectedBank);
    let url = "/api/transfer";
    if (selectedBank.toLowerCase() !== "all") {
      url += "?bankcode=" + selectedBank;
      url += "&date='" + selectedDate + "'";
    } else {
      url += "?date='" + selectedDate + "'";
    }
    //console.log("bankcode changed; url: ", url);
    getTransfer(url);
    const infoData =
      selectedBank.toLowerCase() === "all"
        ? "Daily Transfers"
        : Utility.getBankDetails(selectedBank) + " Transfers";
    setInfoMessage(infoData);
    setUseStorage(true);
    setSelectedBank(selectedBank);
    //console.log(display)
  };

  const timedFetchByDate = (selectedDate) => {
    //console.log("selectedDate: ", selectedDate);
    let url = "/api/transfer";
    url += "?date='" + selectedDate + "'";
    getTransfer(url);
    const infoData = selectedDate + " Transfers";
    setInfoMessage(infoData);
    setUseStorage(true);
    setSelectedDate(selectedDate);
    //console.log(display)
  };

  useEffect(() => {
    const url = "/api/transfer";
    //setSelectedDate()
    getTransfer(url);
    setInterval(() => {
      //console.log("Timmer Triggered call ...");
      setSelectedDate(Utility.getDate(new Date()));
      selectedBank && timedFetch(selectedBank);
    }, Config.appTimer.transfer);
  }, []);

  React.useEffect(() => {
    if (selectedDate) {
      //console.log("selectedDate2: ", selectedDate)
      const t = Utility.dateIsPast(selectedDate);
      t
        ? timedFetchByDate(selectedDate)
        : setInfoMessage("Please select a Past Date!");
    }
  }, [selectedDate]);

  React.useEffect(() => {
    //get transfers based on bankcode for current date
    selectedBank && timedFetch(selectedBank);
  }, [selectedBank]);

  return (
    <div className="">
      {display ? (
        <Loading />
      ) : (
        <TransferTable
          records={records.data}
          handleSetters={handleSetters}
          selectedDate={selectedDate}
          selectedBank={selectedBank}
          useStorage={useStorage}
          bankData={bankData}
          infoMessage={infoMessage}
          setInfoMessage={setInfoMessage}
          sessionName={sessionName}
        />
      )}
    </div>
  );
}

export default Transfer;
