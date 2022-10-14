import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import passport from "passport";
const GitHubStrategy = require("passport-github").Strategy;

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

export const githubLogin = passport.authenticate("github");

export const githubAuth = passport.authenticate("github", {
  failureRedirect: "/login",
});

// passport.authenticate("github", { failureRedirect: "/login" }),
// function (req: Request, res:Response) {
//   res.redirect("/");
// }

export const logout = (req: any, res: Response, next: any) => {
  req.session.user = null;
  req.session.save(function (err: any) {
    if (err) next(err);

    req.session.regenerate(function (err: any) {
      if (err) next(err);
      res.redirect("/login");
    });
  });
};
