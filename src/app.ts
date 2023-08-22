import {session, Telegraf} from "telegraf";
import {IBotContext} from "./context/context.interface";
import {Command} from "./commands/command";
import {StartCommand} from "./commands/start.command";
import {TextCommand} from "./commands/text.command";
import {VoiceCommand} from "./commands/voice.command";
import config from 'config';
import {ConfigService} from "./services/config.service";

class Bot {

    public bot: Telegraf<IBotContext>;
    public commands: Command[] = [];

    constructor(private configService: ConfigService) {

        this.bot = new Telegraf<IBotContext>(this.configService.get('TELEGRAM_TOKEN'));
        this.bot.use(session());
    }

    init() {
        this.commands = [new StartCommand(this.bot), new TextCommand(this.bot), new VoiceCommand(this.bot)];
        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch();
    }

}

const bot = new Bot(new ConfigService());
bot.init();


