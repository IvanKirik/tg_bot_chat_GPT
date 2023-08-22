import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";
import {createReadStream} from "fs";
import {ChatModel} from "../type/chatModel.type";
import {ConfigService} from "./config.service";


class OpenAiService {

    public openai: OpenAIApi;
    public model: ChatModel;
    public sessions: ChatCompletionRequestMessage[] = [];

    get getSessions(): ChatCompletionRequestMessage[] {
        return this.sessions;
    }

    set setSessions(session:ChatCompletionRequestMessage) {
        this.sessions.push(session)
    }

    set chatModel(model: ChatModel) {
        this.model = model;
    }

    constructor(private configService: ConfigService) {
        const configuration = new Configuration({apiKey: this.configService.get('OPENAI_KEY')});
        this.openai = new OpenAIApi(configuration);
    }

    async chat(messages: ChatCompletionRequestMessage[]) {
        try {
            const response = await this.openai.createChatCompletion({
                model: this.model,
                messages,
            })
            return response.data.choices[0].message;
        } catch (e: any) {
            console.log(`Error while gpt chat ${e.message}`);
        }
    }

    async transcription(filePath: any) {
        try {
            const response = await this.openai.createTranscription(
                // @ts-ignore
                createReadStream(filePath),
                'whisper-1'
            )
            return response.data.text;
        } catch (e: any) {
            console.log(`Error while transcription ${e.message}`)
        }
    }

    async imageCreate(description: string) {
        try {
            const response = await this.openai.createImage({
                prompt: description,
                n: 1,
                size: "256x256",
            })

            return response.data.data[0].url;

        } catch (e) {
            console.log(`Error while create image`)
        }
    }
}

export const openAI = new OpenAiService(new ConfigService())
