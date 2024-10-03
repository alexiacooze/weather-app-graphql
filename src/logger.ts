import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "info", 
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new transports.Console(), // This will log to the console
   
    // logging to a file -- new transports.File({ filename: 'logs/error.log', level: 'error' })
  ],
});

export default logger;
