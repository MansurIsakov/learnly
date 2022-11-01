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
  REDIS_URL: z.string().url(),

  /** Images */
  IMAGES_CDN_URL: z.string().url(),

  // Maximum size in bytes.
  IMAGE_UPLOAD_MAX_FILE_SIZE: z
    .number()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((v) => v >= 0)
    .default(20 * 1024 * 1024),

  /** Payments */
  PAYCOM_MERCHANT_ID: z.string(),
  PAYCOM_LOGIN: z.string(),
  PAYCOM_KEY: z.string(),
  PAYCOM_TEST_KEY: z.string().optional(),
  PAYCOM_PAYMENT_TIMEOUT: z
    .number()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((v) => v >= 0)
    .default(12 * 60 * 60),

  /** SMS  */
  SMS_API_URL: z.string().url(),
  SMS_API_USERNAME: z.string(),
  SMS_API_PASSWORD: z.string(),

  /** OTP */
  OTP_TTL: z
    .number()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((v) => v >= 0)
    .default(30 * 60),
  OTP_SALT_ROUNDS: z
    .number()
    .or(z.string().regex(/^\d+$/).transform(Number))
    .refine((v) => v >= 0)
    .default(10),

  /** JWT */
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  JWT_REFRESH_TOKEN_TTL: z.string().default("13d"),

  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_TTL: z.string().default("15m"),

  /** AWS S3 */
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_S3_ENDPOINT_URL: z.string().url(),
  AWS_S3_REGION: z.string(),
  AWS_S3_ACCESS_KEY_ID: z.string(),
  AWS_S3_SECRET_ACCESS_KEY: z.string(),

  /** Node */
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});
