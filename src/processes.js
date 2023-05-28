import fs from 'fs/promises';
import util from 'node:util';
import { exec as execToPromisify } from 'child_process';
import { prefix } from './message.js';

const message = prefix('PROCESSES');
const exec = util.promisify(execToPromisify);

const processesChangedParams = [
    '/usr/share/code/code',
    '/opt/google/chrome/chrome',
    '/usr/share/code/chrome_crashpad_handler',
    '/usr/bin/docker-proxy',
];

const processesSkip = [
    '/opt/google/chrome/chrome',
    /^(\/bin\/sh -c )?ps aux/,
    /^\[kworker\//,
    /^sshd: \[\w+\]/,
    /^sshd: root \[\w+\]/,
    /^sshd: unknown \[\w+\]/,
    /^sshd: \/usr\/sbin\/sshd -D \[listener\]/,
    /^sleep/,

    /// === mail === ///
    /^dovecot\/(imap|quota|lmtp)/,
    // /^dovecot\/auth/,
    /^tlsproxy/,
    /^dnsblog/,
    /^smtpd -n (submission|smtp-amavis|127\.0\.0\.1:\d+) -t (inet|unix) -u/,
    /^smtpd -t pass -u -o/,
    /^cleanup -z -t unix -u -c/,
    /^spawn -z -n policyd-spf/,
    /^\/usr\/bin\/python3 \/usr\/bin\/policyd-spf/,
    /^\/usr\/sbin\/amavisd-new/,
    /^proxymap -t unix -u/,
    /^anvil -l -t unix -u -c/,
    /^postscreen -l -n smtp -t inet/,
    /^lmtp -t unix -u/,
    /^trivial-rewrite -n rewrite/,
    // mysql ?//
    /^\/lib\/systemd\/systemd-udevd/,
];

const processesFile = './processes.json';
let procs = {};
let isInit = false;

try {
    const processesRaw = await fs.readFile(processesFile);
    procs = JSON.parse(processesRaw.toString());
} catch {
    isInit = true;
    await message('init processes file');
    await saveProcesses();
}

async function saveProcesses() {
    await fs.writeFile(processesFile, JSON.stringify(procs, null, '  '));
}

async function check() {
    const { stdout: processesString } = await exec('ps aux');
    const toSave = processesString.split('\n').slice(1).filter(Boolean)
        .reduce((acc, item) => {
            const [user, pid, cpu, mem, ...arr] = item.split(/\s+/);
            const commandArr = arr.slice(6);
            const command = processesChangedParams.includes(commandArr[0]) ? commandArr[0] : commandArr.join(' ');

            if (processesSkip.find(it => it instanceof RegExp ? !!it.exec(command) : it === command)) return acc;

            const key = `${user}-${pid}-${command}`;
            if (procs[`${key}`]) return acc;
            acc[`${key}`] = `${user} ${pid} ${command}`;
            return acc;
        }, {});

    // don't show all processes when run first time
    if(Object.keys(toSave).length) {
        procs = { ...procs, ...toSave };
        if(!isInit) await message(...Object.values(toSave));
        await saveProcesses();
    }

    if(isInit) isInit = false;
}

export default () => setInterval(check, 60 * 1000);
