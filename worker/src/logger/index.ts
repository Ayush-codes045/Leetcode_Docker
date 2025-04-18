import winston from "winston";
const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "dist/logger/error.log", level: "error" }),
        new winston.transports.File({ filename: "dist/logger/info.log",level: "info"}),
        new winston.transports.File({ filename: "dist/logger/combined.log"})
    ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}


  export default logger;