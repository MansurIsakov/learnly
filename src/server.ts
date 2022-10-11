import app from "./";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB = process.env.DATABASE_URI?.replace(
  "<PASSWORD>",
  String(process.env.DATABASE_PASSWORD)
);

if (DB) {
  (async () => {
    try {
      await mongoose.connect(DB);
      console.log("DB connected!");
    } catch (err) {
      console.log(err);
    }
  })();
}

const { PORT } = process.env;

if (!PORT) {
  console.error("ERROR: No PORT specified");
  throw new Error("PORT is not defined in .env");
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
