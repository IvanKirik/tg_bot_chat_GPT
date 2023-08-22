import {Command} from "./command";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {message} from 'telegraf/filters';
import {code} from "telegraf/format";
import {openAI} from "../services/openAi.service";
import {RolesType} from "../type/roles.type";

export class TextCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.on(message('text'), async (ctx) => {
            try {
                await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'));

                openAI.setSessions = {role: RolesType.USER, content: ctx.update.message.text}

                if (ctx.update.message.text!.match(/#img|Сгенерируй изображение/i)) {
                    const response = await openAI.imageCreate(ctx.update.message.text);
                    if (response) {
                        openAI.setSessions = {role: RolesType.ASSISTANT, content: response}
                        await ctx.reply(response);
                    }
                } else {
                    const response = await openAI.chat(openAI.getSessions);

                    if (response && response.content) {
                        openAI.setSessions = {role: RolesType.ASSISTANT, content: response.content}
                        await ctx.reply(response.content);
                    }
                }

            } catch (e: any) {
                console.log(`Error while text message ${e.message}`)
            }
        })
    }
}
