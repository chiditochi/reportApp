import React, { useState, useEffect, Fragment } from 'react';
import Utility from '../../services/utility'
import Config from '../../services/config'



export function AppTime(){
    const [appTime, setAppTime] = useState()
    useEffect(()=>{
        setInterval(()=>{
            setAppTime(Utility.getAppTime())
        }, Config.appTimer.timeApp)
    },[appTime])

    return (
        <Fragment>
            <span>{Utility.getAppTime()}</span>
        </Fragment>
    )

} 

export function AppDate(){
    return (
        <Fragment>
            <span>{Utility.getAppDate()}</span>
        </Fragment>
    )

} 