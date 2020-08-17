import React, { Fragment } from 'react'
import { Link } from "react-router-dom";
  import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
  


export default function Sidebar(){
    const useStyles = makeStyles(theme => ({
        root: {},
    }));
    const classes = useStyles();

    const styles = {
        root: {
            padding: "10px",
        },
        link: {
            textTransform: 'capitalize',
            textDecoration: 'none'
        }
    }

    const sidebarLabel = ['transfer', 'agency', 'query', 'summary', 'statistics'];
   
    return (
        <Fragment>
            <div className='Sidebar' style={styles.root}>
                <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Reports
                    </ListSubheader>
                }
                className={classes.root}
                >
                    {sidebarLabel.map((v,i)=>{
                        return (
                            <Link key={i} to={"/" + v} style={styles.link}>
                                <ListItem button>
                                    <ListItemIcon>
                                    <SendIcon color="secondary"/>
                                    </ListItemIcon>
                                    <ListItemText primary={v} />
                                </ListItem>
                            </Link>
                        )
                    })}
                </List>
            </div>
        </Fragment>
    )
}