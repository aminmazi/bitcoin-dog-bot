import { TelegrafContext } from "telegraf/typings/context";
import { UserModel } from "./src/models/user";

declare module "telegraf/typings/context" {
  export interface TelegrafContext {
    user: UserModel;
  }
}
