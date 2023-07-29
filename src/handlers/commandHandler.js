const fs = require("fs");

module.exports = class CommandHandler {
    constructor(client) {
        this.client = client;

        this.rest = new this.client.discord.REST().setToken(this.client.config.token);
        this.commands = [];
        this.clientCommands = {};
        fs.readdirSync(this.client.commandDir).filter(file => file.endsWith(".js")).forEach(commandFile => {
            const command = require(`${this.client.commandDir}\\${commandFile}`);
            if (command.type != this.client.constants.TYPES.COMMAND_TYPE)
                return false;
            this.client.commands.set(command.data.name, command);
            this.commands.push(command.data.toJSON());
        })
        
    }

    async postCommands() {
        const data = await this.rest.put(
			this.client.discord.Routes.applicationGuildCommands(this.client.user.id, this.client.config.guildId),
			{ body: this.commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
}