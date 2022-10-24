import express, { Express } from "express";
import cors from "cors";
import cookparser from "cookie-parser";
import routes from "../../modules";
import helmet from "helmet";

export const initConfig = (app: Express) => {
  app.use(
    cors({
      origin: "http://localhost:4200",
      credentials: true,
    })
  );
  app.use(express.json({ limit: "15kb" }));

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookparser());
  app.use(helmet());
  app.use("/api/v1", routes);
};