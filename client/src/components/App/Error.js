import React, { Fragment } from 'react'



export default Error = ({ message })=>{
    return (
        <Fragment>
            <div className='Error'>
                {message}
            </div>
        </Fragment>
    )
}