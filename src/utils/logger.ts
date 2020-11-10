import winston from "winston";
import { Loggly } from "winston-loggly-bulk";
import env from "./env";

export let logger: winston.Logger;

export function initLogger() {
  logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
    defaultMeta: { service: "bitcoin-dog-bot" },
    transports: [
      new Loggly({
        token: env.LOG_PASSWORD,
        subdomain: env.LOG_USERNAME,
        tags: ["bitcoin-dog-bot"],
        json: true,
      }),
      new winston.transports.Console(),
    ],
  });
}
