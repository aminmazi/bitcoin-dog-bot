import { incrementUserUsage } from "../service/userService";
import { ContextMessageUpdate } from "telegraf";

export async function attachUser(ctx: ContextMessageUpdate, next: any) {
  if (ctx.from) {
    const user = await incrementUserUsage(ctx);
    //@ts-ignore
    ctx.user = user;
  }
  return next();
}
