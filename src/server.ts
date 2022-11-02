import express from "express";

import { env } from "@env";
import { loader, logger } from "@lib";
import { errorResponse } from "@type";
import mongoose from "mongoose";

const app = express();

(async () => {
  await loader({ expressApp: app });
})();

async function connect() {
  try {
    await mongoose.connect(env.DATABASE_URL!);
    logger.info("Connected to database");
  } catch (error) {
    logger.error("Error connecting to database", error);
    process.exit(1);
  }
}

const server = app.listen(env.PORT, async () => {
  logger.info(
    `Server up and ready on port ${env.PORT} in ${env.NODE_ENV} mode`
  );

  await connect();
});

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
