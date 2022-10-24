import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorResponse } from "./types/errors";
import express from "express";
import { initConfig } from "./common/middlewares";

dotenv.config();

const app = express();
initConfig(app);

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE_URI!);
    console.log("DB CONNECTED");
  } catch (error) {
    console.log("Could not connect to DB");
    process.exit(1);
  }
}

const server = app.listen(process.env.PORT, async () => {
  console.log(`App is running at http://localhost:${process.env.PORT}`);

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
