import https from 'https';
import { prefix } from './message.js';
import domains from '../domains.js';

const { DOMAINS_CHECK_DELAY_DAYS = 1 } = process.env;

const message = prefix('DOMAINS');

async function getSSLCertDaysTTL(hostname) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port: 443,
      method: 'GET',
      agent: false,
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate(true);
      const expirationDate = new Date(cert.valid_to);
      const daysUntilExpiration = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));

      resolve(daysUntilExpiration);
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function checkDomains() {
  for (const domain of domains) {
    try {
      const daysUntilExpiration = await getSSLCertDaysTTL(domain);

      if (daysUntilExpiration > 3) continue;

      const expiredMessage = daysUntilExpiration < 0 ? 'expired' : `will expire in less than ${daysUntilExpiration} days`;
      await message(`Certificate for ${domain} ${expiredMessage}`);
    } catch (error) {
      await message(`Error checking certificate for ${domain}: ${error.message}`);
    }
  }
}

export default () => setInterval(checkDomains, DOMAINS_CHECK_DELAY_DAYS * 24 * 60 * 60 * 1000);
