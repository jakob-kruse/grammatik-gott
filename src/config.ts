import dotenv from "dotenv";
import { z } from "zod";

const configSchema = z.object({
  TWITTER_API_KEY: z.string().min(1),
  TWITTER_API_SECRET: z.string().min(1),
  TWITTER_ACCESS_TOKEN: z.string().min(1),
  TWITTER_ACCESS_TOKEN_SECRET: z.string().min(1),
  TWITTER_OWNER_SCREEN_NAME: z.string().optional(),
  LANGUAGE_TOOL_SERVER_URL: z.string().min(1).url(),
});

const envContent = dotenv.config().parsed;

export const config = configSchema.parse(envContent);
