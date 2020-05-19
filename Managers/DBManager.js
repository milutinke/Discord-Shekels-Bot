const mongoose = require('mongoose');
const BotConfig = require('../BotConfig');
const colors = require('colors');

class DataBaseManager {
    constructor() {
        mongoose.Promise = require('bluebird');
        this.mongoose = mongoose;

        this.url = `mongodb+srv://${BotConfig.database.mongodb_user}:${BotConfig.database.mongodb_password}@${BotConfig.database.mongodb_host}/${BotConfig.database.mongodb_base}?retryWrites=true&w=majority`;
        this.connection = mongoose.connect(this.url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(() => {
            if(BotConfig.debug)
                console.log('DataBase Manager:'.cyan + ' Connected!'.green);
        }).catch(error => console.error(error.red));
    }
}

module.exports = new DataBaseManager();