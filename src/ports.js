import fs from 'fs/promises';
import util from 'node:util';
import { exec as execToPromisify } from 'child_process';
import { prefix } from './message.js';

const message = prefix('PORTS');
const exec = util.promisify(execToPromisify);

const portsFile = './ports.json';
let ports = {};

try {
  const portsRaw = await fs.readFile(portsFile);
  ports = JSON.parse(portsRaw.toString());
} catch {
  await message('init ports file');
  await savePorts();
}

async function savePorts() {
  await fs.writeFile(portsFile, JSON.stringify(ports, null, '  '));
}

async function check() {
  const { stdout: portsString } = await exec('netstat -tulpn');
  const toSave = portsString.split('\n').slice(2).filter(Boolean)
    .reduce((acc, item) => {
      const m = item.match(/^(\w+)[\s\d]+?([\d.:a-f]{3,}).*(\/(\S+)|-)/);
      if (!m) {
        message('cannot parse ports', item);
        return acc;
      }
      if (m[1] === 'udp') m[2] = m[2].split(':')[0];
      const key = `${m[1]}-${m[2]}-${m[3]}`;
      if (ports[`${key}`]) return acc;
      acc[`${key}`] = item;
      return acc;
    }, {});

  if (Object.keys(toSave).length) {
    await message(...Object.values(toSave));
    ports = { ...ports, ...toSave };
    await savePorts();
  }
}

export default () => setInterval(check, 60 * 1000);
