import { Loader } from "@type/loaders";

import * as expressLib from "./express";

export * from "./express";
export * from "./logger";

export const loader: Loader = async ({ expressApp }) => {
  /** Load express middlewares*/
  await expressLib.loader({ app: expressApp });
};
