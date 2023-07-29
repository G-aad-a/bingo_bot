const {TYPES} = require(`${rootDir}\\src\\util\\constants`);

module.exports = {
    type: TYPES.EVENT_TYPE,
    once: true,
    execute: async(client) =>{
        const showData = {
            username: client.user.username,
            id: client.user.id,
            message: `Bot is now online and running`
        }
        console.log(`${JSON.stringify(showData, null, 2)}`)
        new (require(rootDir + "/src/handlers/commandHandler"))(client)//.postCommands();
    }
}