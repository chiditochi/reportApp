import React, { useState, useEffect } from 'react';
import Config from '../../services/config';
import Utility from '../../services/utility';
import Loading from '../App/Loading'
import TransferTable from '../Transfer/TransferTable'

 function Agency() {
  // const styles = {};
  const [records, setRecord]= useState({ data: [], count: 0, bankData: []})
  const [display, setDisplay]= useState(false)
  const [useStorage, setUseStorage]= useState(false);
  const handleSetters = {}
  const [selectedDate, setSelectedDate] = React.useState(null)
  handleSetters['setSelectedDate'] = setSelectedDate
  const [selectedBank, setSelectedBank] = React.useState("All")
  handleSetters['setSelectedBank'] = setSelectedBank;
  const [bankData, setBankData] = React.useState(null)
  const [infoMessage, setInfoMessage] = React.useState("Daily Agency Transfer")
  const [sessionName, setSessionName] = React.useState("agency")

  const getBanks = (data)=>{
    const result = data.reduce((a,c)=>{
        let i = a.findIndex(x=>x===c.destbank);
         if(i === -1)a.push(c.destbank);
        return a;
    }, [])
    setBankData(result)
  }

  async function getTransfer(url){
    setDisplay(true);
    const r = await Utility.getTransfer(url)

    //const bankCodeList = getBanks(r.data)
    //console.log('getTransfer::', url, r.data)
    r.data.length?
    setRecord(prev=>({...prev, data: r.data, count: r.count, bankData: getBanks(r.data)}))
    :setInfoMessage(Utility.getBankDetails(selectedBank) + " Agency Transfer has No result!")
    setDisplay(false);
  
  };

  const timedFetch = (selectedBank )=>{
    //console.log("selectedBank3: ", selectedBank)
    let url = '/api/agencyTransfer';
    if(selectedBank.toLowerCase() !== 'all') url += '?bankcode=' + selectedBank;
    getTransfer(url)
    const infoData = (selectedBank.toLowerCase() === 'all')?
    "Daily Agency Transfers": Utility.getBankDetails(selectedBank) + ' Agency Transfers';
    setInfoMessage(infoData)
    setUseStorage(true)
    setSelectedBank(selectedBank)
    //console.log(display)  
  }


  useEffect(()=>{
    const url = '/api/agencyTransfer'
    getTransfer(url)
    setInterval(()=>{
      //console.log('selectedBank5:', selectedBank)
      selectedBank && timedFetch(selectedBank)
    }, Config.appTimer.agency)
  }, [])

  React.useEffect(()=>{
    if(selectedDate){
      //console.log("selectedDate2: ", selectedDate)
    }
  }, [selectedDate])
  
  React.useEffect(()=>{ //get transfers based on bankcode for current date
    selectedBank && timedFetch(selectedBank)  
  }, [selectedBank])
  
  return (
    <div className="">
      {display ? 
        <Loading />
        :<TransferTable 
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
      }
    </div>
  );
}

//export default Transfer;


export default Agency;
