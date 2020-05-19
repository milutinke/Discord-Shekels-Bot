// Modules
const client = new (require('discord.js')).Client();
const BotConfig = require('./BotConfig');

const CommandManager = require('./Managers/CommandManager');
const ShekelsManager = require('./Managers/ShekelsManager');

// Initialisation
client.on('ready', () => console.log(`${'Logged in as'.green} ${client.user.tag.toString().cyan}`));

// Commands Handler
client.on('message', async messageObject => {
    if (messageObject === undefined)
        return;

    if (messageObject.content.trim().startsWith(BotConfig.bot_prefix)) {
        if (messageObject.author.bot)
            return;

        if (messageObject.channel.id !== BotConfig.notification_channel_id) {
            client.channels.get(BotConfig.notification_channel_id).send(`${messageObject.author} - Goyim, Shekels Bot commands can be executed only in this channel!`);
            messageObject.delete(100);
            return;
        }

        CommandManager.executeCommand(messageObject, client);
    } else {
        if(Math.floor((Math.random() * 100000)) === 1) {
            messageObject.channel.send(':oyvey: We rule the world :oyvey:');
            return;
        }

        if (messageObject.isMentioned(client.user)) {
            messageObject.reply(':oyvey: STFU GOYIM! :oyvey:');
            return;
        }

        if (!messageObject.author.bot)
            return;

        if(!messageObject.content.toLowerCase().includes('shekels'))
            return;

        let stop = false;

        messageObject.content.split(' ').forEach(async piece => {
            if(stop)
                return;

            let text = piece.trim();
            const matches = text.match(/^<@!?(\d+)>$/);

            if (!matches)
                return;

            let user = client.users.get(matches[1]);

            if(!user)
                return;

            let userShekels = await ShekelsManager.getShekels(user.id);
            await ShekelsManager.setShekels(client, user, userShekels + BotConfig.shekels_per_level);
            stop = true;
        });
    }
});

// Bot Deinitialisation
client.on("disconnected", function () {
    console.log('Disconnected'.red);
    process.exit(1);
});

// Bot Login
client.login(BotConfig.bot_token);