import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return next();
  }
  res.redirect("/login");
};
