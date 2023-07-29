const {EmbedBuilder, AttachmentBuilder, SlashCommandBuilder, PermissionsBitField} = require("discord.js")
const {TYPES} = require(`${rootDir}\\src\\util\\constants`);

const MeetsWinCon = (winConds, chosenNumbs) => {
    return winConds.every(item => {
        return chosenNumbs.includes(item);
    });
}

const size = {
    x:400, y:200
}

module.exports = {
    type: TYPES.COMMAND_TYPE,
    permission: PermissionsBitField.Flags.Administrator,
    data: new SlashCommandBuilder()
    .setName("next")
    .setDescription("Ruld et nyt nummer til bingo"),
    execute: async (interaction, client) => {
        const bingoData = await client.getBingoData();

        if (bingoData["bingoRunning"] == false) {
            const embed = new EmbedBuilder()
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
            .setTitle("Bingo Fejl")
            .setDescription(`Der ikke nogen bingo der kører på nuværende tidspunkt`)
            .setColor(0xAF2726)
            .setTimestamp()
            return await interaction.reply({embeds:[embed], ephemeral: true})
        }
        const max = 90
        const min = 1;

        var number = Math.floor(Math.random() * (max-min)+min)
        if(bingoData["chosenNumbers"].length >= 100) {
            const embed = new EmbedBuilder()
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
            .setTitle("Bingo Fejl")
            .setDescription(`Der er ikke flere mulige numre at vælge, jeg lukker bingoen nu!`)
            .setColor(0xAF2726)
            .setTimestamp()
            await interaction.reply({embeds:[embed], ephemeral: true})

            bingoData["bingoRunning"] = false;
            bingoData["participants"].forEach(user => {
                client.contextCache.delete(user.userId)
            });
            bingoData["participants"] = []
            bingoData["chosenNumbers"] = []
            client.setBingoData(bingoData);
            return
        } 
        
        while(bingoData["chosenNumbers"].includes(number)) {
            number = Math.floor(Math.random() * (max-min)+min)
        }
        const embed = new EmbedBuilder()
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
        .setTitle("Bingo Nummer")
        .setDescription(`Det valgte nummer blev: \`\`\`${number}\`\`\` `)
        .setColor(0x347436)
        .setTimestamp()
        await interaction.reply({embeds:[embed]})

        bingoData["chosenNumbers"].push(number)

        bingoData["participants"].forEach(async user => {
            var hasWon = false;
            for(let i=0; i<user.WinCondition.length; i++) {
                //console.log(MeetsWinCon(user.WinCondition[i], bingoData["chosenNumbers"]))
                if(MeetsWinCon(user.WinCondition[i], bingoData["chosenNumbers"])) {
                    const embed = new EmbedBuilder()
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
                    .setTitle("BINGO")
                    .setDescription(`${user.name} har fået bingo!`)
                    .setFields({name: "User-ID", value: user.userId})
                    .setColor(0x347436)
                    .setTimestamp()
                    await interaction.channel.send({embeds:[embed]})
                    //interaction.channel.send({content: `!**Bingo**!: ${user.name}%${user.userId}`});
                    try {
                        const winnerUser = await client.users.fetch(user.userId);
                        winnerUser.send({content: "Du vandt Bingo!"});
                    } catch {}
                    break;
                }
            }
            if(user.pladeNumre.includes(number) && !hasWon) {
                const msgUser = await client.users.fetch(user.userId);
                if(!msgUser.dmChannel) {
                    await msgUser.createDM()
                }
                const message = await msgUser.dmChannel.messages.fetch(user.messageId)
                const {ctx, ctxCanvas} = client.contextCache.get(user.userId);
                const numberIndex = user.pladeNumre.indexOf(number);
                ctx.beginPath();
                ctx.fillStyle = "rgba(255, 0, 0, 0.4);";
                for (let x = 1; x <= 4; x++) {
                    for (let y = 1; y <= 4; y++) {
                        const xC = x-1;
                        const yC = y-1;
                        const sum = yC+(4*xC)
                        //console.log((x*(size.x/4))/2, (y*(size.y/4))/2)
                        if(sum == numberIndex) {
                            ctx.arc(
                                ( x * ( size.x / 4 ) - ( ( size.x / 4 ) / 2 ) ), 
                                ( y * ( size.y / 4 ) - ( ( size.y / 4 ) / 2 ) ) , 
                                19,
                                0, 
                                2 * Math.PI
                            );
                           

                        }
                    }
                }
                ctx.fill();
                const attachment = new AttachmentBuilder(await ctxCanvas.toBuffer("image/png"), { name: 'plade.png' });
                const embed = new EmbedBuilder()
                .setImage(`attachment://plade.png`)
                .setTitle("Bingo Plade")
                .setDescription(`Dette er din bingo plade`)
                .setColor(0x0D6AA2)
                .setTimestamp()
                message.edit({files: [attachment], embeds:[embed]})

               // console.log(message.embeds[0], JSON.stringify(message.embeds[0]))
            }
        });

        client.setBingoData(bingoData);
    } 
}