import React from 'react';
import BarComponent from './BarComponent'


export default function StatsGraph({ chartData, labelName,  useCount,  fieldName }){
    // const [labels, setLabels] = React.useState([]);
    // const [dataSet, setDataSet] = React.useState([]);
    return (
        <BarComponent chartData={chartData} labelName={labelName} useCount={useCount} fieldName={fieldName} />
    )
}