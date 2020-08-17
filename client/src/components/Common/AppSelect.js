import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    color: 'white'
  },
  formControl: {
    minWidth: 120
  },
  formSelectItem: {
      color: 'yellow'
  }
}));

  const setSessionStorageData = (data, name)=>{
    console.log("setSessionStorageData: ", data, name)

    let m = null;
      if(data && data.length){
        sessionStorage.setItem(name, JSON.stringify(data));
        m = true;
      }else{ m = false; }
      console.log(m? 'Session Storage set': 'Session Storage NOT set', data, name)
  }
  const getSessionStorageData = (name, setCurrentBankData)=>{
    let r = null;
    //console.log("getSessionStorageData: ", name)

    if(name){
      r = JSON.parse(sessionStorage.getItem(name));
      //console.log("getSessionStorageData: ", r, name)
      //setCurrentBankData(r);
    }
    return r;
  }
  const isSessionStorageSet = (name)=>{
    const r = JSON.parse(sessionStorage.getItem(name));
    const isSet = r && r.length? true : false;
    return isSet;
  }


export default function ControlledOpenSelect({ handleBankChange, bankData,useStorage, selectedBank, sessionName }) {
  const classes = useStyles();
  const [bank, setBank] = React.useState(selectedBank);
  const [open, setOpen] = React.useState(false);
  const [theBankData, setTheBankData] = React.useState(bankData);
  const [sessionNamet, setSessionName] = React.useState(sessionName);

  const handleChange = event => {
    setBank(event.target.value)
    handleBankChange(event.target.value)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


  React.useEffect(()=>{
    //console.log("Session4: ", selectedBank)
    handleBankChange(selectedBank)  
    if(!useStorage && theBankData) {
      setSessionStorageData(theBankData, sessionNamet)
    }else{
      if(!isSessionStorageSet(sessionNamet)) setSessionStorageData(theBankData, sessionNamet)
      const bd = getSessionStorageData(sessionNamet, setTheBankData)
      setTheBankData(bd)
    }
  }, [useStorage, sessionNamet, selectedBank])


  return (
    <Fragment>
      <Button className={classes.button} onClick={handleOpen}>
        Bank Code
      </Button>
      <FormControl className={classes.formControl}>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={bank}
          onChange={handleChange} 
          className={classes.formSelectItem}
        >
          <MenuItem value="All">
            <em>All</em>
          </MenuItem>
          { theBankData && theBankData.length && theBankData.map((v,i)=>
            <MenuItem key={i} value={v}>{v}</MenuItem>          
          )}
        </Select>
      </FormControl>
    </Fragment>
  );
}
