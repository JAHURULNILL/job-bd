import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().url().optional(),
  MONGODB_DB_NAME: z.string().optional(),
  CRON_SECRET: z.string().min(12).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  SCRAPE_USER_AGENT: z
    .string()
    .default(
      "HSCJobsBDBot/1.0 (+https://www.hscjobsbd.com; respectful crawling for verified public jobs)",
    ),
  SCRAPE_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),
  SCRAPE_DELAY_MS: z.coerce.number().int().positive().default(1500),
  MAX_SCRAPE_CONCURRENCY: z.coerce.number().int().positive().default(2),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = envSchema.parse(process.env);
  return cachedEnv;
}
