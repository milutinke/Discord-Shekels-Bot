const AbstractCommand = require('./AbstractCommand');
const ShekelsManager = require('../Managers/ShekelsManager');
const BotConfig = require('../BotConfig');

class ShekelsCommand extends AbstractCommand {
    constructor() {
        super("shekels", "Displays or Sets user shekels");
    }

    async execute(messageObject, client) {
        let messageArguments = this.getCommandArguments(messageObject.content);

        if (!messageArguments.length) {
            let shekels = await ShekelsManager.getShekels(messageObject.author.id);
            messageObject.channel.send(`${messageObject.author} - Your have ${shekels} shekels.`);
            return;
        }

        if (messageArguments.length == 1) {
            const user = this.getUserFromMention(client, messageArguments[0]);

            if (!user) {
                messageObject.channel.send(`${messageObject.author} - You must tag a valid user! (Usage: #shekels <user>)`);
                return;
            }

            if (user.id === BotConfig.bot_client_id) {
                messageObject.channel.send(`${messageObject.author} - OY VEY, THAT IS FORBIDDEN!`);
                return;
            }

            const userShekels = await ShekelsManager.getShekels(user.id);

            messageObject.channel.send(`${messageObject.author} - Member ${user} has ${userShekels} shekels.`);
            return;
        }

        if (messageArguments.length == 3) {
            const user = this.getUserFromMention(client, messageArguments[0]);
            let action = messageArguments[1];

            if (!user) {
                messageObject.channel.send(`${messageObject.author} - You must tag a valid user! (Usage: #shekels <user> <action: (give|take|set|send)> <number>)`);
                return;
            }

            if (user.id === BotConfig.bot_client_id) {
                messageObject.channel.send(`${messageObject.author} - OY VEY GOYIM, THAT IS FORBIDDEN!`);
                return;
            }

            const userShekels = await ShekelsManager.getShekels(user.id);

            let number = 0;
            let newShekels = 0;
            let stop = false;

            try {
                number = parseInt(messageArguments[2]);
            } catch (e) {
                messageObject.channel.send(`${messageObject.author} - Fourth argument must be a valid number! (Usage: #shekels <user> <action: (give|take|set|send)> <number>)`);
                return;
            }

            if(number === NaN) {
                messageObject.channel.send(`${messageObject.author} - Fourth argument must be a valid number! (Usage: #shekels <user> <action: (give|take|set|send)> <number>)`);
                return;
            }

            switch (action) {
                case 'give':
                    newShekels = userShekels + number;
                    action = 'given';
                    break;

                case 'take':
                    newShekels = userShekels - number;
                    action = 'taken';
                    break;

                case 'set':
                    if(!messageObject.member.hasPermission('ADMINISTRATOR')) {
                    	messageObject.channel.send(`${messageObject.author} - Only Admins can user this command!`);
                    	return;
                    }

                    newShekels = number;
                    break;

                case 'send':
                    if(messageObject.author.id === user.id) {
                        messageObject.channel.send(`${messageObject.author} - You can not send shekels to yourself!`);
                        return;
                    }

                    let authorShekels = await ShekelsManager.getShekels(messageObject.author.id);
                    
                    if (!authorShekels) {
                        messageObject.channel.send(`${messageObject.author} - You do not have any shekels!`);
                        return;
                    }

                    if (authorShekels < number) {
                        messageObject.channel.send(`${messageObject.author} - You do not have enugh shekels, you need ${number - authorShekels} more!`);
                        return;
                    }

                    newShekels = userShekels + number;
                    action = 'sent';

                    await ShekelsManager.setShekels(client, messageObject.author, authorShekels - number);
                    messageObject.channel.send(`${messageObject.author} - Successfully sent! (You now have ${authorShekels - number} shekels)`);
                    break;

                default:
                    messageObject.channel.send(`${messageObject.author} - Invalid action "${action}"! (Usage: #shekels <user> <action: (give|take|set|send)> <number>)`);
                    messageObject.channel.send(`${messageObject.author} - Avaliable actions: give, take, set, send`);
                    stop = true;
                    break;
            }

            if (stop)
                return;

            await ShekelsManager.setShekels(client, user, newShekels);
            messageObject.channel.send(this.generateMessage(user, messageObject.author, action, number, newShekels));
            return;
        }

        messageObject.channel.send(`${messageObject.author} - Invalid number of parameters! (Usage: #shekels <user?> <action? : (give|take|set|send)> <number?>) (? means optional argument)`);
        return;
    }

    generateMessage(receiver, sender, action, number, newValue) {
        return `${receiver} - ${action === 'taken' ? 'Oy vey, ' : '' }${sender} has ${action} ${action === 'taken' ? '' : 'you' } ${number} shekels ${action === 'taken' ? 'from you' : '' }, now you have ${newValue}!`;
    }
}

module.exports = ShekelsCommand;