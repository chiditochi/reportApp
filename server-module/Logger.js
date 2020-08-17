const fs = require("fs");
const moment = require("moment");
const colors = require("colors");
const path = require("path");

exports.getLogger = function (appName) {
  const t = moment().format("YYYY-MM-DD");
  const logFileName = `${appName}-${t}.log`;

  const appPath = path.resolve(__dirname, "../", "logs");
  if (!fs.existsSync(appPath)) fs.mkdirSync(appPath);

  const logger = require("tracer").colorConsole({
    transport: [
      function (data) {
        //logging to file
        fs.appendFile("logs/" + logFileName, data.rawoutput + "\n", (err) => {
          if (err) throw err;
        });
      },
      function (data) {
        //logging to console
        console.log(data.output);
      },
    ],
    filters: {
      log: [colors.bold],
      trace: colors.magenta,
      debug: colors.blue,
      info: colors.green,
      warn: colors.yellow,
      error: [colors.red, colors.bold],
    },
    format: [
      "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}}) Path:: {{path}}", //default format
      {
        error: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})", // error format \nCall Stack:\n{{stack}}
      },
    ],
    dateformat: "HH:MM:ss.L",
    preprocess: function (data) {
      data.title = data.title.toUpperCase();
      //format path variable
      const p = data.path.split(path.sep);
      const filename = p.pop();
      const folder = p.pop();
      const newPath = `${folder}${path.sep}${filename}`;
      data.path = newPath;
    },
  });

  return logger;
};
