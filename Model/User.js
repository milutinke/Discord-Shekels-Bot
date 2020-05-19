// Local modules
const DB = require('../Managers/DBManager').mongoose;

// Create User schema
const userSchema = new DB.Schema({
    authorID: {
        type: String,
        required: true
    },

    shekels: {
        type: Number,
        required: true,
        default: 0
    }
});

// Create User Model
const User = DB.model('User', userSchema);

// Export the User model
module.exports = User;