import {Command} from "./command";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {message} from "telegraf/filters";
import {code} from "telegraf/format";
import {audioConverter} from "../services/audioConverter.service";
import {openAI} from "../services/openAi.service";
import {RolesType} from "../type/roles.type";

export class VoiceCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    public handle() {
        this.bot.on(message('voice'), async (ctx) => {
            try {
                await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'));
                const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
                const userId = String(ctx.message.from.id);
                const oggFilePath = await audioConverter.create(link.href, userId);
                const mp3Path = await audioConverter.toMp3(oggFilePath, userId);

                const text = await openAI.transcription(mp3Path);

                await ctx.reply(code(`Ваш запрос: ${text}`));

                openAI.setSessions = {role: RolesType.USER, content: text}

                if(text!.match(/Сгенерируй изображение/i)) {
                    const response = await openAI.imageCreate(text as string);

                    if(response) {
                        openAI.setSessions = {role: RolesType.ASSISTANT, content: response}
                        await ctx.reply(response);
                    }

                } else {
                    const response = await openAI.chat(openAI.getSessions);

                    if(response && response.content) {
                        openAI.setSessions = {role: RolesType.ASSISTANT, content: response.content}
                        await ctx.reply(response.content);
                    }
                }

            } catch (e: any) {
                console.log(`Error while voice message ${e.message}`)
            }
        })
    }
}
