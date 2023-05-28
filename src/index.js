import watchPorts from './ports.js';
import watchProcesses from './processes.js';
import watchAuth from './watch_auth.js';
import onExit from './exit.js';
import message from './message.js';

await watchPorts();
await watchProcesses();
await watchAuth();

await message('up');
onExit(async () => message('down'));
