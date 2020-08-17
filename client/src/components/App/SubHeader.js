import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import { AppTime } from '../Common/AppTime';
import { Grid } from "@material-ui/core";
// import Paper  from '@material-ui/core/Paper'
import MenuIcon from "@material-ui/icons/AccountBalanceOutlined";
import IconButton from "@material-ui/core/IconButton";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import InfoIcon from "@material-ui/icons/Info";

import AppSelect from "../Common/AppSelect";
import { CalendarUIPicker } from "../Common/AppCalendar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    color: "var(--app-text1)",
    fontSize: "1.3em",
  },
}));

export default function SubHeader({
  showCalendar = false,
  showBanks = false,
  bankData = [],
  handleSetters,
  infoMessage,
  setInfoMessage,
  useStorage,
  selectedBank,
  sessionName,
  targetDate,
}) {
  //console.log("setMyClass: ", setMyClass);
  //console.log("selectedDate in : SubHeader component: ", targetDate);

  const classes = useStyles();
  return (
    <Fragment>
      <AppBar
        position="static"
        style={{ height: "50px", backgroundColor: "#37479c", color: "white" }}
      >
        <Grid container spacing={2}>
          <Grid item sm={4} xs={4}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            {showBanks ? (
              <AppSelect
                handleBankChange={handleSetters.setSelectedBank}
                bankData={bankData}
                useStorage={useStorage}
                selectedBank={selectedBank}
                sessionName={sessionName}
              />
            ) : null}
          </Grid>
          <Grid item sm={4} xs={4}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <InfoIcon />
            </IconButton>
            <span className={classes.title}>{infoMessage}</span>
          </Grid>
          <Grid item sm={4} xs={4}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <CalendarIcon />
            </IconButton>
            {showCalendar ? (
              <CalendarUIPicker
                handleCalendarChange={handleSetters.setSelectedDate}
                fieldSetter={handleSetters.setSelectedDate}
                targetDate={targetDate}
              />
            ) : null}
          </Grid>
        </Grid>
      </AppBar>
    </Fragment>
  );
}
