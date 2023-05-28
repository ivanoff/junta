import fs from 'fs/promises';
import watch from './watch.js';
import message from './message.js';

const file = '/var/log/auth.log';

const matchFunction = (str) => str.match(/session opened for user/)
    || str.match(/sudo:.*USER=/)
    || str.match(/Accepted (publickey|password) for/);

const dismatchFunction = (str) => str.match(/pam_unix\(cron:session\)/);

let watchFileFunction = () => {};
try {
    await fs.access(file, fs.constants.F_OK);
    watchFileFunction = async () => watch('/var/log/auth.log', matchFunction, dismatchFunction);
} catch {
    message(`file ${file} not found`);
}

export default watchFileFunction;
