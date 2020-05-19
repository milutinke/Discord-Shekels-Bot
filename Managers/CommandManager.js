const FileSystem = require('fs');
const Path = require('path');
const Utils = require('../Utils');
const BotConfig = require('../BotConfig');
const colors = require('colors');

class CommandManager {
    constructor() {
        this.commands = new Array();

        // Load Commands
        FileSystem.readdirSync(Path.join(__dirname, '/../Commands')).forEach(file => {
            if(file === undefined || file === null || file.indexOf('.') === -1 || file === '..' || file === '.' || file.includes('AbstractCommand'))
                return;

            let commandPath = Path.join(__dirname, '../Commands', file.substr(0, file.indexOf('.')).trim());

            this.commands.push({
                path: commandPath + '.js',
                js: new (require(commandPath))()
            });
        });

        if(BotConfig.debug) {
            const commandsNumber = this.commands.length;
            console.log(`${'Command Manager:'.cyan} ${commandsNumber === 0 ? commandsNumber.toString().red : commandsNumber.toString().blue} ${'command'.green + (this.commands.length > 1 ? 's'.green : 's'.green)} ${'detected.'.green}`);
        }
    }

    executeCommand(messageObject, client) {
        if(this.commands === undefined || this.commands === null || this.commands.length === 0)
            return;

        let message = messageObject.content.trim();

        if(messageObject === undefined || messageObject === null || message.length === 0)
            return;

        if(message.startsWith(BotConfig.bot_prefix)) {
            for(let i = 0; i < this.commands.length; i ++) {
                let currentCommand = this.commands[i];

                if(currentCommand === undefined || currentCommand === null || currentCommand.path === undefined || currentCommand.path === null)
                    continue;

                if(currentCommand.js === undefined)
                    throw new Error(`Failed to load the command from: ${currentCommand.path}, maybe the modules.export is missing!`.red);

                if(!Utils.commandHasAValidName(currentCommand.js))
                    throw new Error(`The command from ${currentCommand.path} does not have a valid "name" field defined!`.red);

                if(!Utils.commandHasExecuteMethod(currentCommand.js))
                    throw new Error(`The command "${currentCommand.js.name}" (from: ${currentCommand.path}) does not have "execute" method defined!`.red);

                if(message.substr(message.indexOf(BotConfig.bot_prefix) + 1, message.length).trim().includes(currentCommand.js.name))
                    currentCommand.js.execute(messageObject, client);
            }
        }
    }
}

module.exports = new CommandManager();