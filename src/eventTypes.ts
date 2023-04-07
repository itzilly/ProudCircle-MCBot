function cleanFormatting(rawString): string {
    const formattingRegex: RegExp = /§[0-9a-fklmnor]+|[\[\]]+/g
    return rawString.replace(formattingRegex, '')
}

class GuildMessage {
    private readonly message: string
    private readonly sender: GuildMessageSender

    constructor(message: string, sender: GuildMessageSender) {
        this.message = message
        this.sender = sender
    }

    public getContent(): string {
        return this.message
    }

    public getSender(): GuildMessageSender {
        return this.sender
    }
}

class GuildMessageSender {
    private readonly rawUsername: string
    private readonly rawHypixelRank: string
    private readonly rawGuildRank: string

    constructor(rawUsername, rawHypixelRank, rawGuildRank) {
        this.rawUsername = rawUsername
        this.rawHypixelRank = rawHypixelRank
        this.rawGuildRank = rawGuildRank
    }

    public getCleanUsername(): string {
        return cleanFormatting(this.rawUsername)
    }

    public getCleanHypixelRank(): string {
        return cleanFormatting(this.rawHypixelRank)
    }

    public getCleanGuildRank(): string {
        return cleanFormatting(this.rawGuildRank)
    }

    public getRawUsername(): string {
        return this.rawUsername
    }

    public getRawHypixelRank(): string {
        return this.rawHypixelRank
    }

    public getRawGuildRank(): string {
        return this.rawGuildRank
    }

}

class OfficerMessage extends GuildMessage {
    constructor(message: string, sender: GuildMessageSender) {
        super(message, sender)
    }
}

export { GuildMessage, GuildMessageSender, OfficerMessage };