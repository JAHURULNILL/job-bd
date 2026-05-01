import pino from "pino";

export const logger = pino({
  name: "hsc-jobs-bd",
  level: process.env.LOG_LEVEL || "info",
});
