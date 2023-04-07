import mineflayer from 'mineflayer'
import { EventEmitter } from 'events';
import { ConfigHandler } from './config.js'
import { GuildMessage, GuildMessageSender, OfficerMessage } from './eventTypes.js'


// Handle Config
const configFilePath: string = 'config.json';
const configHandler: ConfigHandler = new ConfigHandler(configFilePath);

// Register Emitter
const chatEvents = new EventEmitter();

// Start Bot
const username = configHandler.get('email')  // Silly variable name
const bot = mineflayer.createBot({
    host: 'play.hypixel.net',
    username: username,
    auth: 'microsoft',
    version: '1.8.9'
})


function parseChatMessage(jsonChatMessage): void {
    const extras = jsonChatMessage.json.extra
    let extra_prefix = extras[0].text

    if (extra_prefix.startsWith("§2Guild >") || extra_prefix.startsWith("§3Officer > ")) {
        // Guild Chat Event
        let hypixel_rank = null
        let username = null
        let guild_rank = null

        let splitter = extra_prefix.trim().split(" ")
        if (splitter.length === 4) {
            username = splitter[2]
            guild_rank = splitter[3]
        } else if (splitter.length === 5) {
            hypixel_rank = splitter[2]
            username = splitter[3]
            guild_rank = splitter[4]
        } else {
            console.error("Something went wrong: " + splitter)
            return
        }

        let message = extras[1].text
        const guildMessageSender: GuildMessageSender = new GuildMessageSender(username, hypixel_rank, guild_rank)
        if (extra_prefix.startsWith("§2Guild >")) {
            let guildMessage: GuildMessage = new GuildMessage(message, guildMessageSender)
            chatEvents.emit('guildmsg', guildMessage)
        } else if (extra_prefix.startsWith("§3Officer > ")) {
            let officerMessage: OfficerMessage = new OfficerMessage(message, guildMessageSender)
            chatEvents.emit('officermsg', officerMessage)
        }
    }
}

bot.on('message', async (jsonMsg, position) => {
    parseChatMessage(jsonMsg)
})

chatEvents.on('guildmsg', (guildMessage) => {
    const guildRank: string = guildMessage.getSender.getCleanGuildRank()
    const username: string = guildMessage.getSender().getCleanUsername()
    console.log(`Guild > [${guildRank}] [${username}]`)
})

chatEvents.on('officermsg', (guildMessage) => {
    const guildRank: string = guildMessage.getSender.getCleanGuildRank()
    const username: string = guildMessage.getSender().getCleanUsername()
    console.log(`Officer > [${guildRank}] [${username}]`)
})

