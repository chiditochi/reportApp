import React, { Fragment } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
// import { FormHelperText } from '@material-ui/core';

export default function ErrorPage(){

    const styles = {
        root: {
            backgroundColor: '',
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url("logo192.png")',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            fontSize: '2rem',
            color: 'var(--app-text1)'
        }
    }
    return (
        <Fragment>
            <div style={styles.root}>
                {/* <CircularProgress size='10rem' color='secondary' /> */}
                eCommerce Reporting App: Error!!!
            </div>
        </Fragment>
    )
}