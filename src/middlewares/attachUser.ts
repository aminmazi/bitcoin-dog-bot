import { incrementUserUsage } from "../service/userService";
import { TelegrafContext } from "telegraf/typings/context";

export async function attachUser(ctx: TelegrafContext, next: any) {
  if (ctx.from) {
    const user = await incrementUserUsage(ctx);
    //@ts-ignore
    ctx.user = user;
  }
  return next();
}
