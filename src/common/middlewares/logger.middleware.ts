import morganLogger from "morgan";
import { logger } from "@lib/logger";
import { Response, Request } from "express";

morganLogger.token<Request, Response>("userData", (_, res) => {
  return `{id: ${res.locals?.user?.id}; email: ${res.locals?.user?.email};`;
});

const formatter: morganLogger.FormatFn = (tokens, req, res) => {
  let status: string | number = Number(tokens["status"](req, res));

  const color =
    status >= 500
      ? 31 // red
      : status >= 400
      ? 33 // yellow
      : status >= 300
      ? 36 // cyan
      : status >= 200
      ? 32 // green
      : 31; // red

  status = "\x1b[" + color + "m" + status + "\x1b[0m";

  const method = "\x1b[33m" + tokens["method"](req, res) + "\x1b[0m";

  return `${method} ${tokens["url"](req, res)} ${status} HTTP/${tokens[
    "http-version"
  ](req, res)}  ${tokens["response-time"](req, res)}ms
    Remote Address: ${tokens["remote-addr"](req, res)}
    Referrer: ${tokens["referrer"](req, res)}
    User-Agent: ${tokens["user-agent"](req, res)}${
    tokens["userData"](req, res)
      ? `
    User: ${tokens["userData"](req, res)}`
      : ""
  }`;
};

export const morgan = morganLogger(formatter, {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});
