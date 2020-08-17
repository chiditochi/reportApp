import React, { Fragment } from 'react'
import { Switch, Route  } from "react-router-dom";

export default function Report({ routes }){
    const styles = {
        root: {
            width: 'calc(100vw-250px)'
        }
    };

    return (
        <Fragment>
            <div style={styles.root}>
                <Switch>
                    {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        children={<route.main />}
                    />
                    ))}
                </Switch>
            </div>
        </Fragment>
    )
}