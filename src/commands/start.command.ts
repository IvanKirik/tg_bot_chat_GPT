import {Command} from "./command";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {openAI} from "../services/openAi.service";
import {ChatModel} from "../type/chatModel.type";
import {RolesType} from "../type/roles.type";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle() {
        this.bot.start((ctx) => {
            ctx.reply('Выберите модель чата', Markup.inlineKeyboard([
                Markup.button.callback('GPT 3.5 turbo', 'GPT_3.5'),
                Markup.button.callback('GPT 4', 'GPT_4')
            ]))
        });

        this.bot.action('GPT_3.5', (ctx) => {
            openAI.setSessions = {role: RolesType.USER, content: ChatModel.GPT3}
            openAI.chatModel = ChatModel.GPT3;
            ctx.editMessageText('Жду от вас голосового или текстового сообщения');
        })

        this.bot.action('GPT_4', (ctx) => {
            openAI.setSessions = {role: RolesType.USER, content: ChatModel.GPT4}
            openAI.chatModel = ChatModel.GPT4;
            ctx.editMessageText('Жду от вас голосового или текстового сообщения');
        })
    }
}
