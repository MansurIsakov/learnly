import express, { Express } from "express";
import cors from "cors";

export const initConfig = (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
};
