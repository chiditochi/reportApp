import React from "react";
import Loading from "../App/Loading";

//import Config from '../../services/config';
import Utility from "../../services/utility";
import SubHeader from "../App/SubHeader";
import StatisticsTab from "./StatisticsTab";

function Statistics() {
  const [bankData, setBankData] = React.useState([]);
  const [records, setRecord] = React.useState([]);
  const infoMessageDefault = "Stats for " + Utility.getPaddedDate(new Date());
  const [infoMessage, setInfoMessage] = React.useState(
    "Stats for " + Utility.getPaddedDate(new Date())
  );
  const handleSetters = {};
  const [selectedDate, setSelectedDate] = React.useState(null);
  handleSetters["setSelectedDate"] = setSelectedDate;
  const [selectedBank, setSelectedBank] = React.useState("All");
  handleSetters["setSelectedBank"] = setSelectedBank;
  const [sessionName, setSessionName] = React.useState(null);
  const [shandleSetters, setHandleSetters] = React.useState(handleSetters);
  const [useStorage, setUseStorage] = React.useState(null);
  const [display, setDisplay] = React.useState(false);

  const groupByBank = (d) => {
    let result = null;
    if (d && d.length) {
      result = d.reduce((a, c) => {
        const e = Object.keys(a).findIndex((v) => v === c.destbank);
        a[c.destbank] = e === -1 ? { ...c, sum: 0, count: 0 } : a[c.destbank];
        a[c.destbank].sum += parseFloat(Number(c.sum));
        a[c.destbank].count += parseInt(Number(c.count));
        return a;
      }, {});
    }
    return result;
  };

  const groupByApproved = (d) => {
    let Approved = d && d.filter((v) => v.approved === "Approved");
    Approved = groupByBank(Approved);
    let Declined = d && d.filter((v) => v.approved === "Declined");
    Declined = groupByBank(Declined);
    return [Approved, Declined];
  };

  const groupByRoute = (d) => {
    const NIP =
      d && d.filter((v) => v && v.route && v.route.toLowerCase() === "nip");
    const Direct =
      d && d.filter((v) => v && v.route && v.route.toLowerCase() === "direct");
    return [NIP, Direct];
  };

  const styles = {
    root: {
      // width: '85vw',
      // height: '100vh',
      // // minHeight: '5000px',
      // overflowY: 'scroll'
    },
  };

  async function getTransfer(url) {
    setDisplay(true);
    //setInfoMessage("Stats for " + Utility.getPaddedDate(new Date()))
    const r = await Utility.getTransfer(url);
    //console.log('/api/dailyTransferSummary: ', r)
    //prepare data by grouping
    const [NIP, Direct] = groupByRoute(r.data);
    //console.log('groupByRoute: ', NIP, Direct)
    const NIPBanks = groupByApproved(NIP);
    //console.log('groupByApproved::NIPBanks ', NIPBanks)
    const DirectBanks = groupByApproved(Direct);
    //console.log('groupByApproved::DirectBanks ', DirectBanks)

    const bankCodeList = Utility.getBanks(r.data);
    setBankData(bankCodeList);
    setRecord([DirectBanks, NIPBanks]);
    setDisplay(false);
  }

  const timedFetch = (selectedBank) => {
    console.log("selectedBank3: ", selectedBank);
    let url = "/api/dailyTransferSummary";
    // if(selectedBank.toLowerCase() !== 'all') url += '?bankcode=' + selectedBank;
    getTransfer(url);
    // const infoData = (selectedBank.toLowerCase() === 'all')?
    // "Summary Transfers": Utility.getBankDetails(selectedBank) + ' Transfers';
    //setInfoMessage(infoData)
    setInfoMessage(infoMessageDefault);
    setUseStorage(true);
    setSelectedBank(selectedBank);
    //console.log(display)
  };

  React.useEffect(() => {
    const url = "/api/dailyTransferSummary";
    getTransfer(url);
  }, []);

  React.useEffect(() => {
    if (selectedDate) {
      console.log("summary::selectedDate2: ", selectedDate);
      const url = "/api/dailyTransferSummary?date=" + selectedDate;
      const infoData = "Stats for " + Utility.getPaddedDate(selectedDate);
      setInfoMessage(infoData);
      console.log("Stats for :", infoData);
      getTransfer(url);
    }
  }, [selectedDate]);

  return (
    <div style={styles.root}>
      <SubHeader
        showBanks={false}
        bankData={bankData}
        showCalendar={true}
        infoMessage={infoMessage}
        setInfoMessage={setInfoMessage}
        handleSetters={shandleSetters}
        useStorage={useStorage}
        selectedBank={selectedBank}
        sessionName={sessionName}
      />
      {display ? <Loading /> : <StatisticsTab records={records} />}
    </div>
  );
}

export default Statistics;
