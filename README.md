![junta](./logo.png)

# junta

### Port Monitoring

The program continuously scans the server for new open ports and detects when a new port becomes accessible.

### User Authorization Monitoring

It monitors user authorization activities on the server and detects when new users are granted authorization.

### Program Execution Monitoring

The program keeps track of programs running on the server and identifies when a new program is executed.

### Notification System

When any of the above events occur, the program sends you a notification or message to alert you about the event. This can be done through various communication channels such as email, SMS, or instant messaging.

## Set-up

- clone  repository and install dependences:

```
git clone https://github.com/ivanoff/junta.git
```

```
cd junta && npm install
```

- Add processes that restart periodically to `processes_skip.js` file.

- Create and edit `.env` file. The example of `.env` is below:

```
SERVER_NAME=local

TELEGRAM_BOT_TOKEN=0000000000:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
TELEGRAM_CHATS=000000001,000000002,000000003

SLACK_TOKEN=xoxb-00000000000-0000000000000-AAAAAAAAAAAAAAAAAAAAAAA
SLACK_CHANNELS=CAAAAAAAAAAAAA,CBBBBBBBBBBBBBB
```

`SERVER_NAME` (optional) - name of the server. This information will add to each message.

`TELEGRAM_BOT_TOKEN` (optional) - telegram messenger token. See [Telegram Bots Tutorial](https://core.telegram.org/bots/tutorial)

`TELEGRAM_CHATS` (optional) - list of chat ids to send messages seeparated by comma. See [getUpdates](https://telegram-bot-sdk.readme.io/reference/getupdates) request (result->message->chat->id)

`SLACK_TOKEN` (optional) - slack token. See [Getting a Slack token](https://api.slack.com/tutorials/tracks/getting-a-token)

`SLACK_CHANNELS` (optional) - see channel properties and add bot to this channel

## Start

```
npm start
```

You can use `screen` to start in background mode

## Example

![example](./example.png)
