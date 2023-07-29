const { EmbedBuilder } = require("discord.js");

const {TYPES} = require(`${rootDir}\\src\\util\\constants`);

module.exports = {
    type: TYPES.EVENT_TYPE,
    once: false,
    execute: async(client, interaction) =>{
        if(!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);

        if(command.permission) {
            if(!interaction.member.permissions.has(command.permission)) {
                const embed = new EmbedBuilder()
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
                .setTitle("Permission Fejl")
                .setDescription(`Du har ikke de rigtige permissions til at bruge '${command.data.name}'`)
                .setColor(0xAF2726)
                .setTimestamp()
                return interaction.reply({embeds:[embed] , ephemeral: true})
            }
        }

        if(command) {
            await command.execute(interaction, client);
        }
    }
}