import express, { Express, Request, Response } from "express";
import { initConfig } from "./middlewares/";
import routes from "./routes/";
import passport from "passport";
import { error } from "./utils/apiResponse";
import AppError from "./utils/appError";

const app: Express = express();
initConfig(app);

// express-session
import session from "express-session";
app.use(
  session({
    secret: "magic cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use("/api/v1", routes);
app.use(passport.initialize());
app.use(passport.session());

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
