const fs = require("fs");

module.exports = class EventHandler {
    constructor(client) {
        this.client = client;
        fs.readdirSync(this.client.eventDir).filter(file => file.endsWith(".js")).forEach(eventFile => {
            const event = require(`${this.client.eventDir}\\${eventFile}`)
            if (event.type != this.client.constants.TYPES.EVENT_TYPE)
                return false;
            const eventTempName = eventFile.replace(".js", "");
            const eventName = eventTempName.charAt(0).toUpperCase() + eventTempName.slice(1)

            if (this.client.discord.Events[eventName]) {
                if(event.once) {
                    this.client.once(this.client.discord.Events[eventName], event.execute.bind(null, this.client) ).setMaxListeners(0);
                } else {
                    this.client.on(this.client.discord.Events[eventName], event.execute.bind(null, this.client) ).setMaxListeners(0);
                }
            }
        })
    }
}