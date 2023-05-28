import { Tail } from 'tail';
import onExit from './exit.js';
import { prefix } from './message.js';

export default async (file, matchFunction = () => true, dismatchFunction = () => false) => {
    const message = prefix('WATCH');

    const tail = new Tail(file);

    tail.on('line', async (data) => {
      if (!matchFunction(data)) return;
      if (dismatchFunction(data)) return;
      await message(data);
    });
    
    tail.on('error', function(error) {
      console.log('ERROR: ', error);
    });
    
    onExit(() => tail.unwatch())
}
