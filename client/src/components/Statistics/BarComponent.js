import React from 'react';
import {Bar} from 'react-chartjs-2';
import Utility from '../../services/utility'
import { makeStyles, useTheme } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
    //   backgroundColor: theme.palette.background.paper,
    //   width: '85vw',
    //   minWidth: '85vw',
    //   heigth: '2000px',
      // minHeight: '100vh',
      // overflowY: 'scroll'
     //height: 'inherit', overflowY: 'scroll !important;'

    }
  }));
  

export default function AppBarComponent({ labelName, chartData, fieldName, useCount }){
  const [labels, setLabels] = React.useState([]);
  const [dataSet, setDataSet] = React.useState({ data: { datasets:[], labels:[] }});
  //const [appChartData, setAppChartData] = React.useState({ ...chartData });
  const classes = useStyles();


  React.useEffect(()=>{
    //console.log('BarComponent::', chartData, appChartData)
    if(chartData){
        setLabels(chartData.labels)
        const selectedData = useCount?chartData.countData:chartData.sumData;
        //console
        setDataSet(selectedData)
        //console.log('AppBarComponent::selectedData: ',selectedData)

        //console.log("AppBarComponent::", chartData, selectedData)
        const bgc = labelName.indexOf('Declined')===-1?'rgba(1, 255, 107, 0.2)':'rgba(255,99,132, 0.2)';
        const bc = labelName.indexOf('Declined')===-1?'rgba(1, 255, 107,1)':'rgba(255,99,132,1)';
        const hbgc = labelName.indexOf('Declined')===-1?'rgba(1, 255, 107,0.4)':'rgba(255,99,132,0.4)';

        const d = {
            labels: chartData.labels,
            datasets: [
            {
                label: Utility.capitalize(fieldName),
                backgroundColor: bgc,
                borderColor: bc,
                borderWidth: 1,
                hoverBackgroundColor: hbgc,
                hoverBorderColor: bc,
                data: selectedData && selectedData.length && selectedData.map(v=>{
                  if(v.includes(',')) v = v.split(',').join('')
                  //console.log('data::: ', v, parseInt(Math.floor(v)))
                  //const 
                  return useCount? parseInt(Math.floor(v)): parseFloat(Math.floor(v))
                })
            }
            ]
        };
        setDataSet(d)
        //console.log("Barcomponent:::", labelName, dataSet, fieldName, useCount )
    }
    
  }, [chartData])


    return (
        <React.Fragment>
            <h2>{labelName}</h2>
            <Bar
            data={dataSet}
            width={400}
            height={90}
            className={classes.root}
            options={{
                maintainAspectRatio: true
            
            }}
            />
        </React.Fragment>

    );
};