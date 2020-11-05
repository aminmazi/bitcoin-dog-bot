import { UserModel } from "./src/models/user";
import { Logger } from "winston";

declare module "telegraf/typings/context" {
  export interface TelegrafContext {
    user: UserModel;
    logger: Logger;
  }
}
