import express, { Express } from "express";
import cors from "cors";
import cookparser from "cookie-parser";

export const initConfig = (app: Express) => {
  app.use(
    cors({
      origin: "http://localhost:4200",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookparser());
};
