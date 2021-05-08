import winston from "winston";

export let logger: winston.Logger;

export function initLogger() {
  logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
    defaultMeta: { service: "bitcoin-dog-bot" },
    transports: [new winston.transports.Console()],
  });
}
