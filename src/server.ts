import app from "./";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("Goodbye world!");
  console.log(err.name, err.message);
  process.exit(1);
});

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE_URI!);
    console.log("DB CONNECTED");
  } catch (error) {
    console.log("Could not connect to DB");
    process.exit(1);
  }
}

const port = process.env.PORT || 3000;

const server = app.listen(port, async () => {
  console.log(`App is running at http://localhost:${port}`);

  await connect();
});

process.on("unhandledRejection", (err: any) => {
  console.log("Goodbye, World!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default server;
