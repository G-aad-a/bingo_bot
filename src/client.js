const Discord = require("discord.js");
const { path } = require("express/lib/application");
const fs = require("fs");


module.exports = class Client {
    constructor(config) {
        this.client = new Discord.Client({
            partials: [
                Discord.Partials.Channel,
                Discord.Partials.GuildMember,
                Discord.Partials.Message,
                Discord.Partials.Reaction,
                Discord.Partials.User,
                Discord.Partials.GuildScheduledEvent
            ],
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMembers,
                Discord.GatewayIntentBits.GuildBans,
                Discord.GatewayIntentBits.GuildEmojisAndStickers,
                Discord.GatewayIntentBits.GuildIntegrations,
                Discord.GatewayIntentBits.GuildWebhooks,
                Discord.GatewayIntentBits.GuildInvites,
                Discord.GatewayIntentBits.GuildVoiceStates,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.GuildMessageReactions,
                Discord.GatewayIntentBits.GuildMessageTyping,
                Discord.GatewayIntentBits.DirectMessages,
                Discord.GatewayIntentBits.DirectMessageReactions,
                Discord.GatewayIntentBits.DirectMessageTyping,
                Discord.GatewayIntentBits.GuildScheduledEvents,
                Discord.GatewayIntentBits.MessageContent
            ],
        });

        this.client.commands = new Discord.Collection();
        this.client.discord = Discord;
        this.client.config = config;
        this.client.constants = require("./util/constants");
        this.client.eventDir = `${__dirname}\\events\\`;
        this.client.commandDir = `${__dirname}\\commands\\`;
        this.client.contextCache = new Discord.Collection();    

        this.client.getBingoData = async () => {
            const data = await fs.readFileSync(`${rootDir}\\src\\data.json`, "utf-8")
            return JSON.parse(data);
        }

        this.client.setBingoData = async (data) => {
            await fs.writeFileSync(`${rootDir}\\src\\data.json`, JSON.stringify(data, null, 2), {flag:"w+"})
            return true;
        }

        new (require("./handlers/eventHandler"))(this.client);
    }






    login() {
        if(this.client) {
            this.client.login(this.client.config.token).then(() => {
            })
        }
    }
}