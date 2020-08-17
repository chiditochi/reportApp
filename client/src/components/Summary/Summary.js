import React from 'react';
import Loading from '../App/Loading'

import Config from '../../services/config';
import Utility from '../../services/utility';
import SubHeader from '../App/SubHeader';
import SummaryTab from './SummaryTab';

function Summary() {
  const [bankData, setBankData] = React.useState([]);
  const [records, setRecord] = React.useState([]);
  const infoMessageDefault = "Today's Summary Transfers"
  const [infoMessage, setInfoMessage] = React.useState(infoMessageDefault);
  const handleSetters = {}
  const [selectedDate, setSelectedDate] = React.useState(null)
  handleSetters['setSelectedDate'] = setSelectedDate
  const [selectedBank, setSelectedBank] = React.useState("All")
  handleSetters['setSelectedBank'] = setSelectedBank;
  const [sessionName, setSessionName] = React.useState(null);
  const [shandleSetters, setHandleSetters] = React.useState(handleSetters);
  const [useStorage, setUseStorage] = React.useState(null);
  const [display, setDisplay] = React.useState(false);

  async function getTransfer(url){
    setDisplay(true);
    const r = await Utility.getTransfer(url)
    //console.log('/api/dailySummaryCountnVolume: ', r)
    const bankCodeList = Utility.getBanks(r.data)
    setBankData(bankCodeList)
    setRecord(prev=>({...prev, data: r.data, count: r.count, bankData: bankCodeList}))
    setDisplay(false);
  };

  const timedFetch = (selectedBank )=>{
    //console.log("selectedBank3: ", selectedBank)
    let url = '/api/dailySummaryCountnVolume';
    getTransfer(url)
    setInfoMessage(infoMessageDefault)
    setUseStorage(true)
    setSelectedBank(selectedBank)
    //console.log(display)  
  }


  React.useEffect(()=>{
    const url = '/api/dailySummaryCountnVolume'
    getTransfer(url)
    setInterval(()=>{
      selectedBank && timedFetch(selectedBank)
    }, Config.appTimer.summary)
  },[])

  React.useEffect(()=>{
    if(selectedDate){
      //console.log("summary::selectedDate2: ", selectedDate)
      const url = '/api/dailySummaryCountnVolume?date=' + selectedDate
      const infoData = ' Summary for ' + selectedDate;
      setInfoMessage(infoData)
      getTransfer(url)
       
    }
  }, [selectedDate])


  return (
    <div className="">
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
        {display ? 
        <Loading />:<SummaryTab records={records} />
      }
    </div>

  );
}

export default Summary;
