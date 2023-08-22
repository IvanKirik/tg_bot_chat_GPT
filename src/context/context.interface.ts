import { Context } from "telegraf";

export interface SessionData {
    messages: any[]
}

export interface IBotContext extends Context {
    session: SessionData;
}
