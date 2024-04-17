import { prefix } from './message.js';
import urls from '../urls.js';

const { URLS_CHECK_DELAY_SECONDS = 600 } = process.env;

const message = prefix('URLS');

async function checkUrls() {
  for (const url of urls) {
    try {
      const response = await fetch(url, { timeout: 10000 });
      if (!response.ok) await message(`${url} returned status code ${response.status}`);
    } catch (error) {
      await message(`${url} check error: ${error.message}`);
    }
  }
}

export default () => setInterval(checkUrls, URLS_CHECK_DELAY_SECONDS * 1000);
