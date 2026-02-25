![junta](./logo.png)

# junta

Lightweight server monitor that reports events to console, Telegram, and Slack.

## What it monitors

- Open ports (`netstat -tulpn`, every 60 seconds). Alerts only for newly observed entries.
- Running processes (`ps aux`, every 60 seconds). Alerts only for newly observed processes.
- Auth activity (`/var/log/auth.log` via `tail`). Matches logins, `sudo` activity, and opened sessions.
- URL availability (configured in `urls.js`, interval via env).
- TLS certificate expiry (configured in `domains.js`, interval via env). Alerts when a cert has 3 or fewer days left.
- Free disk space (configured in `disks.js`, interval and threshold via env). Alerts on low space and recovery.

## Notification channels

- Console output (always enabled)
- Telegram (`TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHATS`)
- Slack (`SLACK_TOKEN` and `SLACK_CHANNELS`)

## Requirements

- Node.js 18+
- Linux host with `netstat` available
- Read access to `/var/log/auth.log` (auth watcher is skipped if the file does not exist)

## Setup

```bash
git clone https://github.com/ivanoff/junta.git
cd junta
npm install
cp .env.example .env
```

Optional configuration files:

- `urls.js` for URL checks
- `domains.js` for certificate checks
- `disks.js` for mount points to check free space
- `processes_skip.js` for noisy processes to ignore

Edit `.env` as needed:

```dotenv
SERVER_NAME=local

URLS_CHECK_DELAY_SECONDS=600
DOMAINS_CHECK_DELAY_DAYS=1
DISK_CHECK_DELAY_HOURS=1
DISK_CHECK_THRESHOLD_GB=20

TELEGRAM_BOT_TOKEN=0000000000:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
TELEGRAM_CHATS=000000001,000000002,000000003

SLACK_TOKEN=xoxb-00000000000-0000000000000-AAAAAAAAAAAAAAAAAAAAAAA
SLACK_CHANNELS=CAAAAAAAAAAAAA,CBBBBBBBBBBBBBB
```

### Environment variables

- `SERVER_NAME`: Prefix added to every message.
- `URLS_CHECK_DELAY_SECONDS`: URL check interval in seconds. Default is `600`.
- `DOMAINS_CHECK_DELAY_DAYS`: TLS check interval in days. Default is `1`.
- `DISK_CHECK_DELAY_HOURS`: Disk check interval in hours. Default is `1`.
- `DISK_CHECK_THRESHOLD_GB`: Low-space threshold in GB. Default is `20`.
- `TELEGRAM_BOT_TOKEN`: Telegram bot token.
- `TELEGRAM_CHATS`: Comma-separated chat IDs.
- `SLACK_TOKEN`: Slack token.
- `SLACK_CHANNELS`: Comma-separated Slack channel IDs.

## Run

```bash
npm start
```

`npm start` runs `nodemon` in watch mode and sends `up` on startup and `down` on exit.

## Example

![example](./example.png)
