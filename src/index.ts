import express, { Express, Request, Response } from "express";
import { initConfig } from "./middlewares/";
import routes from "./routes/";
const GitHubStrategy = require("passport-github").Strategy;
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
initConfig(app);

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

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

passport.serializeUser(function (user: any, cb: any) {
  cb(null, user.id);
});

passport.deserializeUser(function (id: any, cb: any) {
  cb(null, id);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "3ef818cca1179b87e1d2",
      clientSecret: "76c2f39da7662a4bc8bdd6da26679ac009de0ab2",
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken: any, refreshToken: any, profile: any, cb: any) {
      console.log(profile);

      cb(null, profile);
    }
  )
);

app.get("/login", (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.sendFile(__dirname + "/login.html");
});

app.get("/logout", (req: any, res: Response, next: any) => {
  req.session.user = null;
  req.session.save(function (err: any) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err: any) {
      if (err) next(err);
      res.redirect("/login");
    });
  });
});

const isAuth = (req: Request, res: Response, next: any) => {
  if (req.user) {
    return next();
  }
  res.redirect("/login");
};

// Dashboard
app.get("/", isAuth, (req: Request, res: Response) => {
  console.log(req.user);

  res.sendFile(__dirname + "/dashboard.html");
});

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

export default app;
