import React from "react";
import clientConfig from "../../clientAppConfig.json";
import { BrowserRouter as Router } from "react-router-dom";
// import Footer from './Footer';
import Header from "./Header";
import Report from "./Report";
import Sidebar from "./Sidebar";
import Transfer from "../Transfer/Transfer";
import Agency from "../Agency/Agency";
import Statistics from "../Statistics/Statistics";
import Summary from "../Summary/Summary";
import Query from "../Query/Query";
import Paper from "@material-ui/core/Paper";

const routes = [
  {
    path: ["/", "/transfer"],
    exact: true,
    main: () => <Transfer />,
  },
  {
    path: "/agency",
    main: () => <Agency />,
  },
  {
    path: "/query",
    main: () => <Query />,
  },
  {
    path: "/summary",
    main: () => <Summary />,
  },
  {
    path: "/statistics",
    main: () => <Statistics />,
  },
];

export default function Layout() {
  const styles = {
    itemsLeft: {
      minHeight: "100vh",
      maxHeight: "100vh",
      scroll: "none",
    },
    itemsRight: {
      minHeight: "100%",
    },

    Paper2: {
      height: "100%",
      backgroundColor: "lighgrey",
      minHeight: "100%",
      height: "100vh",
    },
    PaperLeft: {
      height: "100%",
      backgroundColor: "lighgrey",
      minHeight: "100vh",
      height: "100vh",
      width: "250px",
      minWidth: "250px",
    },
    PaperRight: {
      height: "100%",
      backgroundColor: "lighgrey",
      width: "85vw",
    },
    testContainter: {
      display: "grid",
      gridTemplateColumns: "1fr 4fr",
      gridGap: "10px",
    },
    leftPart: {
      position: "fixed",
    },
    rightPart: {
      position: "fixed",
      left: "250px",
    },
  };

  return (
    <Router>
      {/* <Grid container spacing={2} style={{minHeight: '100vh'}}>
          <Grid item sm={2} xs={2}  style={styles.itemsLeft}>
            <Paper elevation={3} style={styles.Paper}>
            <Sidebar />
            </Paper>
          </Grid>
          <Grid item sm={10} xs={10}  style={styles.itemsRight}>
            <Header  appName={clientConfig.app.name}/>
            <Paper style={styles.Paper}>
              <Report routes={routes} />
            </Paper>
          </Grid>
      </Grid> */}

      <div container spacing={2} style={styles.testContainter}>
        <div style={styles.leftPart}>
          <Paper elevation={3} style={styles.PaperLeft}>
            <Sidebar />
          </Paper>
        </div>
        <div style={styles.rightPart}>
          <Header appName={clientConfig.app.name} />
          <Paper style={styles.PaperRight}>
            <Report routes={routes} />
          </Paper>
        </div>
      </div>
    </Router>
  );
}
