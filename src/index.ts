import mineflayer from 'mineflayer'
import { EventEmitter } from 'events'
import {EmbedBuilder, hyperlink, WebhookClient} from 'discord.js'
import ConfigHandler from './config.js'
import { GuildMessage, GuildMessageSender, OfficerMessage } from './eventTypes.js'


// Handle Config
const configFilePath: string = 'config.json';
const configHandler: ConfigHandler = new ConfigHandler(configFilePath);

// Register Emitter
const chatEvents = new EventEmitter();

// Start Bot
const username = configHandler.get('email')  // Silly variable name
if (username === '') {
    process.exit(101)
}
const bot = mineflayer.createBot({
    host: 'play.hypixel.net',
    username: username,
    auth: 'microsoft',
    version: '1.8.9'
})

// Add Webhook Client
const webhookUrl = configHandler.get('webhook_url')
const webhookClient = new WebhookClient({ url: webhookUrl });


function parseGuildMessage(jsonChatMessage): void {
    const extras = jsonChatMessage.json.extra
    let extra_prefix = extras[0].text

    if (extra_prefix.startsWith("§2Guild >") || extra_prefix.startsWith("§aO > ")) {
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
        } else if (extra_prefix.startsWith("§aO > ")) {
            let officerMessage: OfficerMessage = new OfficerMessage(message, guildMessageSender)
            chatEvents.emit('officermsg', officerMessage)
        }
    }
}

function parsePersonalMessage(message: string): void {
    let fromPortion = message.split(": ")
    if (!(fromPortion[0].startsWith("From "))) {
        return;
    }
    let fromSplit = fromPortion[0].split(" ")
    if (fromSplit[fromSplit.length - 1] !== "illyum") {
        return;
    }

    let contents = fromPortion[1]
    if (contents.startsWith("!joinparty")) {
        bot.chat("/party accept illyum")
    } else if (contents.startsWith("!say ")) {
        bot.chat("/gc " + contents.replace("!say ", ""))
    }  if (contents.startsWith("!reply ")) {
        bot.chat("/msg illyum " + contents.replace("!reply ", ""))
    }
}

bot.once('spawn', () => {
    console.log("Bot Logged In!")
})

bot.on('message', async (jsonMsg, position) => {
    try {
        parseGuildMessage(jsonMsg)
    } catch (err) {}
})

bot.on('messagestr', (message, position, jsonMsg) => {
    try {
        parsePersonalMessage(message)
    } catch (err) {}
})


chatEvents.on('guildmsg', (guildMessage: GuildMessage) => {
    const guildRank: string = guildMessage.getSender().getCleanGuildRank()
    const username: string = guildMessage.getSender().getCleanUsername()
    const msg: string = guildMessage.getContent()

    if (username === "ProudCircle") {
        return
    }

    if (msg.startsWith("!")) {
        if (guildMessage.getContent().startsWith("!joinparty")) {
            bot.chat("/party accept " + username)
        } else if (guildMessage.getContent().startsWith("!say ")) {
            bot.chat("/gc " + guildMessage.getContent().replace("!say ", ""))
        }
    } else {
        let content: string
        if (guildMessage.getSender().getCleanHypixelRank() === null) {
            content = `[${username}] ${guildRank}: \`${msg}\``
        } else {
            content = `[${guildMessage.getSender().getCleanHypixelRank()}] [${username}] ${guildRank}: \`${msg}\``
        }
        const embed = new EmbedBuilder()
            .setTitle(content)
            .setColor(0x00AA00);

        webhookClient.send({
            embeds: [embed]
        });
    }

    console.log(`Guild > [${guildRank}] [${username}]: ${guildMessage.getContent()}`)
    if (guildRank === "Staff") {
        if (guildMessage.getContent().startsWith("!joinparty")) {
            bot.chat("/party accept " + username)
        } else if (guildMessage.getContent().startsWith("!say ")) {
            bot.chat("/gc " + guildMessage.getContent().replace("!say ", ""))
        }
    }
})

chatEvents.on('officermsg', (guildMessage: GuildMessage) => {
    const guildRank: string = guildMessage.getSender().getCleanGuildRank()
    const username: string = guildMessage.getSender().getCleanUsername()
    const msg: string = guildMessage.getContent()
    console.log(`Officer > [${username}]: ${guildMessage.getContent()}`)
    if (guildMessage.getContent().startsWith("!joinparty")) {
        bot.chat("/party accept " + username)
    } else if (guildMessage.getContent().startsWith("!say ")) {
        bot.chat("/gc " + guildMessage.getContent().replace("!say ", ""))
    }
})

