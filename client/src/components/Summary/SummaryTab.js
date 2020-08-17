import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SummaryTable from './SummaryTable';

import Config from '../../services/config';
import Utility from '../../services/utility';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '85vw',
    minWidth: '85vw'
  },
  nip: { backgroundColor: '#3f51b5', color: 'white !important;'}
}));

export default function FullWidthTabs({ records }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  /* table logic*/
  const tableRecords = (records)=>{
      //console.log("SummaryTab: ", records)
    //setInfoMessage('Daily Transfer')
      const data = records && records.reduce((a,c,i)=>{
          const index = i+1;
          let { Day,SourceBank,DestBank,BankCode,Route,Approved,Reversed,Count,ReversedCount,Value} = c;
          //format data here 
          //requesttime = requesttime && Utility.formatDate(requesttime);
          //responsetime = responsetime && Utility.formatDate(responsetime);
          Value = Value && Utility.formatCurrency(Value);
          Count = Count && Utility.formatCurrency(Count, false);
          ReversedCount = ReversedCount && Utility.formatCurrency(ReversedCount, false);
          Approved = Approved?"true":"false";
          Reversed = Reversed?"true":"false";
        //   reversible = approved?"true":"false";
          a.push({index,Day,SourceBank,DestBank,BankCode,Route,Approved,Reversed,Count,ReversedCount,Value})
          return a;
      }, [])
    
      return data;
  };
  const tableHeaders = ()=>{
      const list = [{
          uid: 'index', label: '#', minWidth: 10}];
      const fields = Config.summaryFields;
      const field = Config.tranferColumn;
      fields.forEach(v=>{
          let f = { ...field};
          f.uid = v;
          f.label = Utility.capitalize(v)
          //if(f.label === 'Value') f.label = /*'<span>&#x20A6;</span>' +*/ f.label;
          list.push(f);
      })
      return list;
  };
  
  const filterByRoute = (d)=>{//returns [ NIP, Direct ]
    let NIP  = [];
    let Direct = [];
    d && d.map(v=>{
        if(v && v.Route==='NIP') { v.index = NIP.length + 1; NIP.push(v); }
        else if(v && v.Route && v.Route.toLowerCase() === 'direct') { v.index = Direct.length + 1; Direct.push(v);}
    })
    //console.log('filterByRoute: ', NIP, Direct)
    return [ NIP, Direct ];
  }

const columns = tableHeaders()
const rows = tableRecords( records.data )
//console.log('rows: ', rows);
const [NIP, Direct] = records && filterByRoute(rows)
//console.log('[NIP, Direct]: ', NIP, Direct)


  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          
        >
          <Tab label="UPIR" className={classes.nip} {...a11yProps(0)} />
          <Tab label="NIP" {...a11yProps(1)} />
          {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <SummaryTable records={Direct} columns={columns} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <SummaryTable records={NIP}  columns={columns} />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
