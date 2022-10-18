import express, { Express, Request, Response } from "express";
import { initConfig } from "./middlewares/";
import routes from "../src/routes";
import { error } from "./utils/apiResponse";
import AppError from "./utils/appError";

const app: Express = express();
initConfig(app);

app.use("/api/v1", routes);

app.all("*", (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err: any, req: any, res: any, next: any) => {
  try {
    res
      .status(err.statusCode ?? 500)
      .json(error(err.message, err.statusCode ?? 500));
  } catch (e) {
    next(e);
  }
});

export default app;
