const {SlashCommandBuilder} = require("discord.js");
const {TYPES} = require(`${rootDir}\\src\\util\\constants`);

module.exports = {
    type: TYPES.COMMAND_TYPE,
    permission: false,
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping test"),
    execute: async (interaction) => {
        await interaction.reply({content: "Pong!"})
    } 
}