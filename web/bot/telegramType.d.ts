import { Context, Scenes } from "telegraf";

export interface SessionData {
  awaitingReferral?: boolean;
}

export interface CustomContext extends Context {
  session: SessionData;
}
