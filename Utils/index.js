class Utils {
    static commandHasExecuteMethod(commandObject) {
        return (commandObject !== undefined && (typeof commandObject['execute'] !== undefined) && (typeof commandObject['execute'] === 'function'));
    }

    static commandHasAValidName(commandObject) {
        return (commandObject !== undefined && commandObject.hasOwnProperty('name') !== false);
    }
}

module.exports = Utils;