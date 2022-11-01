import express from "express";

import { env } from "@env";
import { loader, logger } from "@lib";
import { errorResponse } from "@type";

const app = express();

(async () => {
  await loader({ expressApp: app });
})();

const server = app.listen(env.PORT, () =>
  logger.info(`Server up and ready on port ${env.PORT} in ${env.NODE_ENV} mode`)
);

// Uncaught Exception Handler && Unhandled Rejection Handler
process.on("uncaughtException", (err) => {
  console.log("Goodbye world!");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err: errorResponse) => {
  console.log("Goodbye, World!");
  console.log(err.statusCode, err.message);
  server.close(() => {
    process.exit(1);
  });
});
