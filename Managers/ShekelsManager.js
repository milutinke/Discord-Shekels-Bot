const User = require('../Model/User');
const BotConfig = require('../BotConfig');

class ShekelsManager { // Shekels manager, aka the Jew
    static async setShekels(client, author, number) {
        const authorID = author.id;
        const user = await User.findOne({authorID});

        if(!user) {
            await new User({authorID, shekels: number}).save();
            return;
        }

        user.shekels = number;
        await user.save();
    }

    static async getShekels(id) {
        const user = await User.findOne({authorID: id});
 
        if(!user)
             return 0;
 
        return user.shekels;
    }

    static async getTop10() {
        return await User.find({}).sort({'shekels': -1}).limit(10);
    }
}

module.exports = ShekelsManager;