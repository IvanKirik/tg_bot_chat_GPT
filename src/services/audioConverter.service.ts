import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
import {dirname, resolve} from "path";
import {removeFile} from "../utils/removeFile";
import {createWriteStream} from "fs";
import axios from "axios";

export class AudioConverterService {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path);
    }

    public toMp3(input: any, output: string) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`);
            return new Promise((resolve, reject) => {
                ffmpeg(input)
                    .inputOptions('-t 30')
                    .output(outputPath)
                    .on('end', () => {
                        removeFile(input)
                        resolve(outputPath)
                    })
                    .on('error', (err) => {
                        reject(err.message)
                    })
                    .run()
            })
        } catch (e: any) {
            console.log(`Error while creating mp3 ${e.message}`)
        }
    }

    public async create(url: string, filename: string) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
            const response = await axios({
                method: 'GET',
                url,
                responseType: 'stream'
            })

            return new Promise(resolve => {
                const stream = createWriteStream(oggPath);
                response.data.pipe(stream);
                stream.on('finish', () => resolve(oggPath));
            })

        } catch (e: any) {
            console.log(`Error while creating ogg ${e.message}`)
        }

    }
}

export const audioConverter = new AudioConverterService();
