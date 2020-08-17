import React from 'react';
import Config from '../../services/config';
import Utility from '../../services/utility';
import SubHeader from '../App/SubHeader';
import Loading from '../App/Loading'
import QueryResultTable from './ResultTable';
import QueryForm from './QueryForm';
import ErrorPage from '../App/ErrorPage'

function Query() {
  const [infoMessage, setInfoMessage] = React.useState("Query Page")
  const [search, setSearch]= React.useState({ type: '', searchID: ''})
  const [display, setDisplay]= React.useState(false)
  const [queryResult, setQueryResult] = React.useState({data: null, count: 0})
  const [showErrorPage, setShowErrorPage] = React.useState(false)


const callQueryHandler = ({ type, searchID })=>{
  //console.log('Query: ', queryID)
  setSearch(c=>({ ...c, type: type, searchID: searchID }))
}

async function getTransfer(url){
  setDisplay(true);
  url += (search.type==='requestid')?
  '?requestid=' + search.searchID: '?reference=' + search.searchID;
  //console.log('url: ', url)
  const r = await Utility.getTransfer(url)
  //console.log('Query r: ', r)
  let infoData = r.statuscode === 200? 'Query ' + r.message + ' | (' + r.count + ')'
  : 'Query Failed!';
  setInfoMessage(infoData)
  r.statuscode === 200? setQueryResult(c=>({...c, data: r.data, count: r.count})) : setShowErrorPage(true);
  //console.log('queryResult: ', queryResult)

  setDisplay(false);
};


React.useEffect(()=>{
  const url = '/api/queryByID'
  search && search.searchID.length && getTransfer(url)
}, [search])


  return (
    <div className="">
      <SubHeader 
      showBanks={false} 
      bankData={null} 
      showCalendar={false} 
      infoMessage={infoMessage} 
        />
        <QueryForm callQueryHandler={callQueryHandler}/>
        {
          display?
          <Loading />
          :showErrorPage? <ErrorPage />:
          <QueryResultTable queryResult={queryResult} />
        }
    </div>
  );
}

export default Query;
