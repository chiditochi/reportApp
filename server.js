require("dotenv").config();
const express = require("express");
const serverConfig = require("./serverConfig.json");

const appConfig = require("./server-module/appConfig");

const { APP_SERVER_PORT, APP_LOGNAME } = process.env;
const Logger = require("./server-module/Logger").getLogger(APP_LOGNAME);

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = APP_SERVER_PORT;

//attach serverConfig to app
app.reportAppConfig = serverConfig;
//attach Logger to the app
app.Logger = Logger;

//attach appConfig to the app
appConfig(app);

app.listen(PORT, () => {
  Logger.warn(`Report App listening on port ${PORT}`);
});
