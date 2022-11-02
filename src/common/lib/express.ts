import express, { Response as EResponse } from "express";
import helmet from "helmet";
import cors from "cors";

import { backResponse } from "@type";
import { ExpressLoaderParams } from "@type/loaders/express";

import errorHandler from "@middlewares/error.middleware";
import { rateLimiterLib } from "@middlewares/rateLimit.middleware";
import { morgan } from "@middlewares/logger.middleware";

import router from "@modules/router";

export const loader = async ({ app }: ExpressLoaderParams) => {
  /** req.body middlewares */
  app.use(express.json({ limit: "15kb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  /** Helmet */
  app.use(helmet());

  app.enable("trust proxy");
  app.use(morgan);
  /** CORS */
  app.use(
    cors({
      origin: "http://localhost:4200",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      maxAge: 3600, // 1 hour
    })
  );

  /** Rate Limiter */
  app.use(rateLimiterLib());

  /** API routes */
  app.use("/api/v1", router);

  /** 404 handler */
  app.use("*", (_, res: EResponse) =>
    backResponse.notFound(res, { message: "Endpoint does not exist" })
  );

  /** Error handler */
  app.use(errorHandler);
};
