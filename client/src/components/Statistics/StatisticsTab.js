import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import StatsGraph from './StatsGraph';
import StatsCard from './StatsCard';
import Grid from '@material-ui/core/Grid'
//import Divider from '@material-ui/core/Divider';

//import Config from '../../services/config';
import Utility from '../../services/utility';
import SwitchComponent from './SwitchComponent'

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
    minWidth: '85vw',
  },
  nip: { backgroundColor: '#3f51b5', color: 'white !important;'},
  displayRoot: {
    height: '500px', 
    //minHeight: '100vh', 
    position: 'sticky',
    overflowY: 'scroll',

  }
}));

export default function StatisticsTabs({ records }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);


  //const defaultChartSet = { labels: [], countData: [], sumData: []}
  const [directApproved, setDirectApproved] = React.useState({ labels: [], countData: [], sumData: []});
  const [directDeclined, setDirectDeclined] = React.useState({ labels: [], countData: [], sumData: []});
  const [nipApproved, setNIPApproved] = React.useState({ labels: [], countData: [], sumData: []});
  const [nipDeclined, setNIPDeclined] = React.useState({ labels: [], countData: [], sumData: []});
  const [cardData, setCardData] = React.useState([]);
  const [useCount, setUseCount] = React.useState(true);
  const [fieldName, setFieldName] = React.useState("count");  // 'count|value'

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
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

  const populateLabelnData = (d)=>{
       let r = { labels: [], countData: [], sumData: []};
       const result = d && Object.entries(d).reduce((a,c)=>{
           a.labels.push(Utility.getBankDetails(c[0]))
        //    a.countData.push(Utility.formatCurrency(c[1].count, false))
        //    a.sumData.push(Utility.formatCurrency(c[1].sum, true))

        //console.log("populateLabelnData::", )

        let count = c[1].count
        let sum = c[1].sum
        if(count.includes(',')) count = count.split(',').join('')
        if(sum.includes(',')) sum = sum.split(',').join('')

        //console.log('data::: ', v, parseInt(Math.floor(v)))
        //const 
        //return parseInt(Math.floor(v))

        a.countData.push(count)
        a.sumData.push(sum)
        //console.log("populateLabelnData::", a)
           return a;
       }, { labels: [], countData: [], sumData: []})

       //console.log('populateLabelnData: ', result)
       //updater(result)
        return result;       
  }

const prepareCardData = (rec)=>{
    const result = { 
        directApproved: [],
        directDeclined: [],
        nipApproved: [],
        nipDeclined: []
    }
    if(rec){
        rec[0].map(v=>{ 
            v && Object.values(v).map(p=>{ 
                p['bankname']= Utility.getBankDetails(p.destbank);
                p.sum = Utility.formatCurrency(p.sum, true)
                p.count = Utility.formatCurrency(p.count, false);
                (p.approved ==='Approved')
                ?result.directApproved.push(p):result.directDeclined.push(p) 
            })
            //console.log(v[1])
        });
        rec[1].map(v=>{ 
            v && Object.values(v).map(p=>{ 
                p['bankname']= Utility.getBankDetails(p.destbank);
                p.sum = Utility.formatCurrency(p.sum, true)
                p.count = Utility.formatCurrency(p.count, false);
                (p.approved ==='Approved')
                ?result.nipApproved.push(p):result.nipDeclined.push(p) 
            })
        })
        setCardData(result)
    }
    return result;
}

  React.useEffect(()=>{
    const cloneRecords = {...records}
    const cloneRecords2 = {...records}
    const direct = cloneRecords2[0]
    const nip = cloneRecords2[1]

    const cData = records.length && prepareCardData(cloneRecords)

    const approvedDirectDataSet = direct &&  populateLabelnData(direct[0], setDirectApproved)
    const declinedDirectDataSet = direct &&  populateLabelnData(direct[1], setDirectDeclined)
    const approvedNIPDataSet = direct &&  populateLabelnData(nip[0], setNIPApproved)
    const declinedNIPDataSet = direct &&  populateLabelnData(nip[1], setNIPDeclined)

    setDirectApproved(approvedDirectDataSet)
    setDirectDeclined(declinedDirectDataSet)
    setNIPApproved(approvedNIPDataSet)
    setNIPDeclined(declinedNIPDataSet)

    console.log("useEffect::", records, directApproved)

  }, [records])

  React.useEffect(()=>{
    const direct = records[0]
    const nip = records[1]
    const cloneRecords = {...records}

    const approvedDirectDataSet = direct &&  populateLabelnData(direct[0], setDirectApproved)
    const declinedDirectDataSet = direct &&  populateLabelnData(direct[1], setDirectDeclined)
    const approvedNIPDataSet = direct &&  populateLabelnData(nip[0], setNIPApproved)
    const declinedNIPDataSet = direct &&  populateLabelnData(nip[1], setNIPDeclined)

    setDirectApproved(approvedDirectDataSet)
    setDirectDeclined(declinedDirectDataSet)
    setNIPApproved(approvedNIPDataSet)
    setNIPDeclined(declinedNIPDataSet)

    console.log("useEffect::", records, directApproved)

  }, [useCount])




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
          <Tab label="Graph" className={classes.nip} {...a11yProps(0)} />
          <Tab label="Card" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
        
      >
        <TabPanel  value={value} index={0} dir={theme.direction} >
          <SwitchComponent useCount={useCount} setUseCount={setUseCount} setFieldName={setFieldName} fieldName={fieldName} />
            <Grid container  className={classes.displayRoot}>
                <Grid item keys={1} variant="outline" xs={12}>
                    <StatsGraph 
                    chartData={directApproved} 
                    labelName={'Direct Approved'} 
                    useCount={useCount} 
                    fieldName={fieldName}  />
                </Grid>
                <hr width={'100%'} size={'20px'} color={'var(--app-text1)'} />
                <Grid item  keys={2}  variant="outline" xs={12}>
                    <StatsGraph 
                    chartData={directDeclined} 
                    labelName={'Direct Declined'} 
                    useCount={useCount} 
                    fieldName={fieldName}  />
                </Grid>
                <hr width={'100%'} size={'20px'} color={'red'} />
                <Grid item  keys={3}  variant="outline" xs={12}>
                    <StatsGraph 
                    chartData={nipApproved} 
                    labelName={'NIP Approved'} 
                    useCount={useCount} 
                    fieldName={fieldName}  />
                </Grid>
                <hr width={'100%'} size={'20px'} color={'var(--app-text1)'} />
                <Grid item  keys={4}  variant="outline" xs={12}>
                    <StatsGraph 
                    chartData={nipDeclined} 
                    labelName={'NIP Declined'} 
                    useCount={useCount} 
                    fieldName={fieldName}  />
                </Grid>
                <hr width={'100%'} size={'20px'} color={'red'} />
            </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
            <Grid container  className={classes.displayRoot}>
                {<StatsCard data={cardData}  />}
            </Grid>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}