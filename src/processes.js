import fs from 'fs/promises';
import util from 'node:util';
import { exec as execToPromisify } from 'child_process';
import { prefix } from './message.js';
import processesSkip from '../processes_skip.js';

const message = prefix('PROCESSES');
const exec = util.promisify(execToPromisify);

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
      const command = arr.slice(6).join(' ');
      if (processesSkip.find((it) => (it instanceof RegExp ? !!it.exec(command) : it === command))) return acc;

      const key = `${user}-${pid}-${command}`;
      if (procs[`${key}`]) return acc;
      acc[`${key}`] = `${user} ${pid} ${command}`;
      return acc;
    }, {});

  // don't show all processes when run first time
  if (Object.keys(toSave).length) {
    procs = { ...procs, ...toSave };
    if (!isInit) await message(...Object.values(toSave));
    await saveProcesses();
  }

  if (isInit) isInit = false;
}

export default () => setInterval(check, 60 * 1000);
