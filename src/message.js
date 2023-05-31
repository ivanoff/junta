import 'the-log';
import { WebClient } from '@slack/web-api';
import * as dotenv from 'dotenv';
dotenv.config();

const {
    SERVER_NAME,
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHATS,
    SLACK_TOKEN,
    SLACK_CHANNELS,
} = process.env;

const slack = async (text) => {
    if (!SLACK_TOKEN || !SLACK_CHANNELS) return;

    const web = new WebClient(SLACK_TOKEN);
    for (const channel of SLACK_CHANNELS.split(',')) {
        await web.chat.postMessage({ text, channel })
    }
};

const telegram = async (text) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHATS) return;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const headers = { 'Content-Type': 'application/json' }

    for (const chat_id of TELEGRAM_CHATS.split(',')) {
        const body = JSON.stringify({ chat_id, text });
        await fetch(url, { method: 'POST', headers, body });
    }
};

const message = async (...textArray) => {
    for (const t of [].concat(textArray)) {
        const text = SERVER_NAME ? `[${SERVER_NAME}] ${t}` : t;
        console.log(text);

        try {
            await Promise.all([
                telegram(text),
                slack(text),
            ]);
        } catch(err) {
            console.log(err);
        }
    }
}

const prefix = (prefix) => async (...textArray) => message(...textArray.map(item => `[${prefix}] ${item}`));

export { prefix };
export default message;
