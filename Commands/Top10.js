const AbstractCommand = require('./AbstractCommand');
const ShekelsManager = require('../Managers/ShekelsManager');
const BotConfig = require('../BotConfig');
const Discord = require('discord.js');

class Top10 extends AbstractCommand {
    constructor() {
        super("top10", "Displays top 10 richest jews");
    }

    async execute(messageObject, client) {
        let results = await ShekelsManager.getTop10();
        let message = `Top 10 richest jews:\n\n`;

        for(let i = 0; i < results.length; i++)
            message += `${i+1}. ${client.guilds.get(messageObject.guild.id).member(await client.fetchUser(results[i].authorID)).displayName} (Shekels: ${results[i].shekels})\n`;

        messageObject.channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(message));
    }
}

module.exports = Top10;