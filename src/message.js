import 'the-log';
import * as dotenv from 'dotenv';
dotenv.config();

const {
    SERVER_NAME,
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHATS,
} = process.env;

const telegram = async (text) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHATS) return;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const headers = { 'Content-Type': 'application/json' }

    for(const chat_id of TELEGRAM_CHATS.split(',')) {
        const body = JSON.stringify({ chat_id, text });
        await fetch(url, { method: 'POST', headers, body });
    }
};

const message = async (...textArray) => {
    for(const t of [].concat(textArray)) {
        const text = `[${SERVER_NAME}] ${t}`
        console.log(text);
        await telegram(text);
    }
}

const prefix = (prefix) => async (...textArray) => message(...textArray.map(item => `[${prefix}] ${item}`));

export { prefix };
export default message;
