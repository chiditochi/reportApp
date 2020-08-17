import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import CardComponent from './CardComponent'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
//import StatsGraph from './StatsGraph';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

const useStyles = makeStyles({
  root: {
    maxWidth: '345',
    width: 'inherit'
  },
  media: {
    height: 140,
  },
});

const styles = {
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridGap: '10px'
    },
    oddTheme: {
        backgroundColor: '#eee',
        // color: 'var(--app-text1)'
    }
}

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
  
export default function StatsCard({ data }) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [cardData, setCardData] = React.useState(data);
    const [labels, setLabels] = React.useState(['UPIR Approved', 'UPIR Declined', 'NIP Approved', 'NIP Declined']);

    //console.log("cardData: ", cardData);
    //const item = {};

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

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
                {labels.map((v,i)=>(
                    <Tab key={i} label={v} className={classes.nip} {...a11yProps({i})} />
                ))}
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
              {Object.values(cardData).map((v,i)=>(
                <TabPanel value={value} index={i} dir={theme.direction} key={i}>
                    <Grid container spacing={3}>
                        <CardComponent data={v} />
                    </Grid>    
                </TabPanel>
              ))}
          </SwipeableViews>
        </div>
    
  )

}
