import { Logger, format, transports, createLogger, config } from "winston";
import { env } from "@env";

type LoggerConfig = {
  console: transports.ConsoleTransportOptions;
};

const options: LoggerConfig = {
  console: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    handleExceptions: true,
    format: format.combine(
      format.colorize(),
      format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}\n`
      )
    ),
  },
};

export const logger: Logger = createLogger({
  level: "debug",
  levels: config.syslog.levels,
  format: format.combine(
    format.timestamp({
      format: () => `[${new Date().toISOString()}]`,
    }),
    format.json(),
    format.errors({ stack: true })
  ),
  transports: [new transports.Console(options.console)],
  exitOnError: false,
});
