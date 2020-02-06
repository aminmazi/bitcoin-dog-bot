import { ContextMessageUpdate } from "telegraf";
import { UserModel } from "./src/models/user";

declare module "telegraf/typings" {
  export interface ContextMessageUpdate {
    user: UserModel;
  }
}
