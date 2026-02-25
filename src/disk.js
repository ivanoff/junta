import util from 'node:util';
import { execFile as execFileToPromisify } from 'child_process';
import disks from '../disks.js';
import { prefix } from './message.js';

function getNumberFromEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined) return fallback;

  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

const diskCheckDelayHours = getNumberFromEnv('DISK_CHECK_DELAY_HOURS', 1);
const diskCheckThresholdGB = getNumberFromEnv('DISK_CHECK_THRESHOLD_GB', 20);

const message = prefix('DISK');
const execFile = util.promisify(execFileToPromisify);
const stateByMount = new Map();

const configuredMountPoints = Array.isArray(disks)
  ? [...new Set(disks.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean))]
  : [];
const mountPoints = configuredMountPoints.length ? configuredMountPoints : ['/'];

async function getDiskInfo(mountPoint) {
  const { stdout } = await execFile('df', ['-kP', mountPoint]);
  const lines = stdout.trim().split('\n');
  const line = lines[lines.length - 1];
  const parts = line.trim().split(/\s+/);

  if (parts.length < 6) {
    throw new Error(`cannot parse df output for ${mountPoint}`);
  }

  const [, total1k, , available1k, , mountedOn] = parts;
  const total = Number.parseInt(total1k, 10) * 1024;
  const free = Number.parseInt(available1k, 10) * 1024;

  if (!Number.isFinite(total) || !Number.isFinite(free)) {
    throw new Error(`cannot parse df output for ${mountPoint}`);
  }

  return { total, free, mountedOn };
}

async function checkMountPoint(mountPoint) {
  const previousState = stateByMount.get(mountPoint);

  try {
    const { total, free, mountedOn } = await getDiskInfo(mountPoint);
    const totalGb = total / (1024 ** 3);
    const freeGb = free / (1024 ** 3);
    const currentState = freeGb < diskCheckThresholdGB ? 'low' : 'ok';

    if (currentState === 'low' && previousState !== 'low') {
      await message(`${mountedOn}: low disk space, ${freeGb.toFixed(2)} GB free of ${totalGb.toFixed(2)} GB (threshold: ${diskCheckThresholdGB} GB)`);
    }

    if (currentState === 'ok' && previousState === 'low') {
      await message(`${mountedOn}: disk space recovered, ${freeGb.toFixed(2)} GB free of ${totalGb.toFixed(2)} GB`);
    }

    stateByMount.set(mountPoint, currentState);
  } catch (error) {
    if (previousState !== 'error') {
      await message(`${mountPoint}: error checking disk space: ${error.message}`);
    }

    stateByMount.set(mountPoint, 'error');
  }
}

async function checkDiskSpace() {
  await Promise.all(mountPoints.map((mountPoint) => checkMountPoint(mountPoint)));
}

export default () => {
  checkDiskSpace();
  return setInterval(checkDiskSpace, diskCheckDelayHours * 60 * 60 * 1000);
};
