const {TYPES} = require(`${rootDir}\\src\\util\\constants`);
const canvas = require('canvas')
const {EmbedBuilder, AttachmentBuilder, SlashCommandBuilder} = require("discord.js")
const size = {
    x:400, y:200
}

module.exports = {
    type: TYPES.COMMAND_TYPE,
    permission: false,
    data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Tilslut dig den nuværende bingo der er kørende på servern"),
    execute: async (interaction, client) => {

        const bingoData = await client.getBingoData()
        var hasJoined = false;
        
        if (bingoData["bingoRunning"] == false) {
            const embed = new EmbedBuilder()
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
            .setTitle("Bingo Fejl")
            .setDescription(`Der ikke nogen bingo der kører på nuværende tidspunkt`)
            .setColor(0xAF2726)
            .setTimestamp()
            return await interaction.reply({embeds:[embed], ephemeral: true})
        }
        

        bingoData["participants"].forEach(participant => {
            if(hasJoined == true) return;
            if(participant.userId == interaction.user.id) {
                hasJoined = true
            }
        });

        if(hasJoined) {
            const embed = new EmbedBuilder()
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
            .setTitle("Bingo Fejl")
            .setDescription(`Du har allerede tilsluttet dig bingo`)
            .setColor(0xAF2726)
            .setTimestamp()
            return await interaction.reply({embeds:[embed], ephemeral: true})
        }
        const numbers = []
        for (let i = 1; i <= 4 * 4; i++) {
            const max = (i * 5.625);
            var min = (max-5);
            if(min<=0) {
                min = 1
            }
        
            var num = Math.floor(Math.random() * (max - min) + min)
            while(numbers.includes(num)) {
                num = Math.floor(Math.random() * (max - min) + min)
            }
            if(num>90) {
                num = (90-num)+num-Math.floor(Math.random() * (5 - 0) + 0)
            }
            numbers.push(num)
        }
        const ctxCanvas = canvas.createCanvas(size.x, size.y)
        const ctx = ctxCanvas.getContext("2d");

        ctx.beginPath()
        
        ctx.fillStyle = '#414141'
        ctx.fillRect(0, 0, size.x, size.y);

        ctx.strokeStyle = '#161616'
        ctx.lineWidth = 4;
        for (let i = 1; i < 4; i++) {
            ctx.moveTo(i*(size.x/4),0)
            ctx.lineTo(i*(size.x/4),size.y)

            ctx.moveTo(0, i*(size.y/4))
            ctx.lineTo(size.x, i*(size.y/4))
        }
        ctx.stroke()


        ctx.beginPath()
        //console.log(numbers)
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = '#D1D1D1'
        ctx.lineWidth = 12;
        for (let x = 1; x <= 4; x++) {
            for (let y = 1; y <= 4; y++) {
                const xC = x-1;
                const yC = y-1;
                const sum = yC+(4*xC)
                //console.log((x*(size.x/4))/2, (y*(size.y/4))/2)
                ctx.fillText(
                    numbers[sum].toString(), 
                    ( x * ( size.x / 4 ) - ( ( size.x / 4 ) / 2 ) ), 
                    ( y * ( size.y / 4 ) - ( ( size.y / 4 ) / 2 ) ) + 4
                );
            }
        }

        ctx.stroke()

        const winnerCombinations = [];
        for (let x = 1; x <= 4; x++) {
            const combination = [];
            for (let y = 1; y <= 4; y++) {
                const xC = x-1;
                const yC = y-1;
                const sum = xC+(4*yC)
                combination.push(numbers[sum])
                
            }
            winnerCombinations.push(
                combination
            );
        }

        console.log(winnerCombinations)
        const userBingoData = {
            userId: interaction.user.id,
            name: interaction.user.username,
            avatar: interaction.user.avatar,
            avatarURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp?size=512`,
            pladeNumre: numbers,
            messageId: null,
            WinCondition: winnerCombinations
        }
        
        //require("fs").writeFileSync("hey.png", ctxCanvas.toBuffer("image/png"), {flag:"w+"});
        const attachment = new AttachmentBuilder(await ctxCanvas.toBuffer("image/png"), { name: 'plade.png' });
        const bingoPlade = new EmbedBuilder()
        .setImage(`attachment://plade.png`)
        .setTitle("Bingo Plade")
        .setDescription(`Dette er din bingo plade`)
        .setColor(0x0D6AA2)
        .setTimestamp()

        try {
            await interaction.user.send({files: [attachment], embeds:[bingoPlade]}).then(msg => {
                userBingoData.messageId = msg.id
            })
        } catch {
            const embed = new EmbedBuilder()
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
            .setTitle("Bingo Fejl")
            .setDescription(`Der skete en fejl da jeg skulle sende dig en DM, Husk at have dm's slået til`)
            .setColor(0xAF2726)
            .setTimestamp()
            return await interaction.reply({embeds: [embed], ephemeral:true})
        }

        client.contextCache.set(interaction.user.id, {ctx: ctx, ctxCanvas: ctxCanvas})

        bingoData["participants"].push(userBingoData)
        //console.log(bingoData["participants"])
        client.setBingoData(bingoData);
        const embed = new EmbedBuilder()
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
        .setTitle("Tjek dine DM's")
        .setDescription(`Du har fået tilsendt din bingo plade i DM's`)
        .setColor(0x0D6AA2)
        .setTimestamp()
        interaction.reply({ephemeral: true, embeds:[embed]})

    } 
}