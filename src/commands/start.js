const {SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const {TYPES} = require(`${rootDir}\\src\\util\\constants`);

module.exports = {
    type: TYPES.COMMAND_TYPE,
    permission: PermissionsBitField.Flags.Administrator,
    data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Starter bingo i servern"),
    execute: async (interaction, client) => {
        const bingoData = await client.getBingoData()
        bingoData["bingoRunning"] = true;
        client.setBingoData(bingoData);
        const embed = new EmbedBuilder()
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
        .setTitle("Bingo Startet")
        .setColor(0xAF2726)
        .setTimestamp()
        await interaction.reply({embeds:[embed], ephemeral: true})
    } 
}