import { incrementUserUsage } from "../service/userService";

export async function attachUser(ctx: any, next: any) {
  if (ctx.from) {
    incrementUserUsage(ctx.from);
  }
  next();
}
