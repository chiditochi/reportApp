import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
// import Config from '../../services/config';
// import Utility from '../../services/utility';
import Grid from '@material-ui/core/Grid'


const useStyles = makeStyles({
  root: {
    maxWidth: '345',
  },
  rootEmpty: {
    maxWidth: '345px',
    minHeight: '300px'
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
    },
    labelTheme: {
      backgroundColor: '#37479c',
      color: 'white',
      padding: '10px',
      borderRadius: '5px'
    },
    naira: {
      color: 'hsla(0,100,75,0.5)',
      fontSize: '1.5em'
    }
}

export default function StatsCard({ data }) {
  const [cardData, setCardData] = React.useState(data);
   
  const classes = useStyles();
  //console.log("data: ", cardData);
  //const item = {};

  return (
    <React.Fragment>
         { 
         (Object.values(cardData).length)?
          
            Object.values(cardData).map((item,i)=>(
              <Grid item xs={4} key={i} >
              <Card key={i} className={classes.root} variant={'elevation'}  style={(i%2===0)? styles.oddTheme:null}>
                  <CardActionArea>
                  <CardContent>
                      <Typography style={styles.labelTheme} gutterBottom variant="h5" component="h2">
                      {(item.route.toLowerCase()==='direct')?'UPIR':'NIP'} <small style={{color: '#f19510', marginRight: 10, marginLeft: 10}}>for</small>      {item.bankname}
                      </Typography>
                      <List component="nav" className={classes.root} aria-label="mailbox folders">
                          <ListItem button>
                              <ListItemText primary="Bank" />
                              <ListItemText primary={item.destbank} />
                          </ListItem>
                          <Divider />
                          <ListItem button divider>
                              <ListItemText primary="Status" />
                              <ListItemText primary={item.approved.toUpperCase()} />
                          </ListItem>
                          <ListItem button>
                              <ListItemText primary="Count" />
                              <ListItemText primary={item.count} />
                          </ListItem>
                          <Divider light />
                          <ListItem button>
                              <ListItemText primary="Value" />
                              <span style={styles.naira}>&#x20A6;&nbsp;</span><ListItemText primary={ item.sum} />
                          </ListItem>
                  </List>
                  </CardContent>
                  </CardActionArea>
              </Card>
            </Grid>
            ))
          :
              <Grid item xs={6} key={0} >
                <Card className={classes.rootEmpty} variant={'elevation'}  style={(1%2===0)? styles.oddTheme:null}>
                    <CardActionArea>
                      <CardContent>
                          <Typography style={styles.labelTheme} gutterBottom variant="h3" component="h2">
                          No Bank
                          </Typography>
                          <List component="nav" className={classes.root} aria-label="mailbox folders">
                              <ListItem button>
                                  <ListItemText primary="Bank" />
                                  <ListItemText primary="No Record(s)" />
                              </ListItem>
                              <Divider />
                          </List>
                      </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

          }
      </React.Fragment>
  )

}
