import { createLogger, format, transports } from "winston";

const { combine, timestamp, prettyPrint } = format;
export const winstonLogger = (filename = "logfile.log") => {
  const logger = createLogger({
    level: "error", // Set the log level to 'error' to log only errors.
    format: combine(timestamp(), prettyPrint()), // You can choose a different format if needed.
    transports: [new transports.File({ filename, level: "error" })],
  });
  return logger;
};

export default function () {
  process.on("uncaughtException", (ex) => {
    winstonLogger("uncaughtException.log").error(ex);
    console.log(ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    winstonLogger("unhandledRejection.log").error(ex);
    console.log(ex);
    process.exit(1);
  });
}
