import express, { Express, Request, Response } from "express";
import { initConfig } from "./middlewares/";
import routes from "./routes/";

const app: Express = express();
initConfig(app);

app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
