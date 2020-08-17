import React, { Fragment } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
// import { FormHelperText } from '@material-ui/core';

export default function Loading(){

    const styles = {
        root: {
            backgroundColor: '',
            height: '100vh',
            width: '85vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
    return (
        <Fragment>
            <div style={styles.root}>
                <CircularProgress size='10rem' color='secondary' />
            </div>
        </Fragment>
    )
}