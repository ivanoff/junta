![junta](./logo.png)

# junta

### Port Monitoring

The program continuously scans the server for new open ports and detects when a new port becomes accessible.

### User Authorization Monitoring

It monitors user authorization activities on the server and detects when new users are granted authorization.

### Program Execution Monitoring

The program keeps track of programs running on the server and identifies when a new program is executed.


### Url Monitoring

The program periodically checks a list of URLs to ensure that the websites are accessible and responding correctly. If a URL becomes inaccessible or returns an unexpected response, the program will alert the user.
To configure the URLs to be monitored, you can add them to the `urls.js` file.

### Domain Certificates Monitoring

The program monitors the SSL/TLS certificates for domains associated with the server. It alerts the user when a certificate is about to expire, allowing them to renew the certificate in a timely manner and ensure the continued security of the website.
To monitor SSL/TLS certificates, the program uses the `domains.js` file to specify the domains to be monitored. You can add or remove domains from this file as needed.

### Notification System

When any of the above events occur, the program sends you a notification or message to alert you about the event. This can be done through various communication channels such as email, SMS, or instant messaging.
Add processes that restart periodically to `processes_skip.js` file to exclude annoying messages.

## Set-up

- clone  repository and install dependences:

```
git clone https://github.com/ivanoff/junta.git
```

```
cd junta && npm install
```

- (optional) Add URLs that you want to monitor to the urls.js file.

- (optional) Add domains that you want to monitor SSL/TLS certificates to the `domains.js` file.

- (optional) Add processes that restart periodically to `processes_skip.js` file.

- Create and edit `.env` file. The example of `.env` is below:

```
SERVER_NAME=local

URLS_CHECK_DELAY_SECONDS=600
DOMAINS_CHECK_DELAY_DAYS=1

TELEGRAM_BOT_TOKEN=0000000000:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
TELEGRAM_CHATS=000000001,000000002,000000003

SLACK_TOKEN=xoxb-00000000000-0000000000000-AAAAAAAAAAAAAAAAAAAAAAA
SLACK_CHANNELS=CAAAAAAAAAAAAA,CBBBBBBBBBBBBBB
```

- `SERVER_NAME` (optional) - name of the server. This information will be added to each message.

- `URLS_CHECK_DELAY_SECONDS` (optional) - the delay in seconds between checking the URLs. Default is 600 seconds (10 minutes).

- `DOMAINS_CHECK_DELAY_DAYS` (optional) - the delay in days between checking the domain certificates. Default is 1 day.

- `TELEGRAM_BOT_TOKEN` (optional) - telegram messenger token. See [Telegram Bots Tutorial](https://core.telegram.org/bots/tutorial)

- `TELEGRAM_CHATS` (optional) - list of chat ids to send messages seeparated by comma. See [getUpdates](https://telegram-bot-sdk.readme.io/reference/getupdates) request (result->message->chat->id)

- `SLACK_TOKEN` (optional) - slack token. See [Getting a Slack token](https://api.slack.com/tutorials/tracks/getting-a-token)

- `SLACK_CHANNELS` (optional) - see channel properties and add bot to this channel

## Start

```
npm start
```

You can use `screen` to start in background mode

## Example

![example](./example.png)
