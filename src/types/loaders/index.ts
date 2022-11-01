import { Application } from "express";

export type Loader = ({
  expressApp,
}: {
  expressApp: Application;
}) => Promise<void>;
