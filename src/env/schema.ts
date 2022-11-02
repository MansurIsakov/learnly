import { z } from "zod";

/**
 * Specify your environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  /** Server */
  PORT: z
    .number()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((v) => v > 0),

  /** Database */
  DATABASE_URL: z.string().url(),

  /** JWT */
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN_MS: z.string().default("360000"),

  /** Node */
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});
