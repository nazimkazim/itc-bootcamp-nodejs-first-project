import { format } from "date-fns";
import {v4 as uuid} from "uuid";
import fs from "fs";
const fsPromises = fs.promises;
import path from "path";

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`;
  const logMessage = `${dateTime}\t${uuid()}\t ${message}`;

  try {
    if (!fs.existsSync(path.join(__dirname, "../logs"))) {
      fs.mkdirSync(path.join(__dirname, "../logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "../logs", logFileName, logMessage)
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logger };
