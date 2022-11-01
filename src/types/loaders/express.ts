import { Application } from "express";

export type ExpressLoader = ({ app }: { app: Application }) => Promise<void>;
export type ExpressLoaderParams = { app: Application };
