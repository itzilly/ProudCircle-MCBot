function cleanFormatting(rawString) {
    const formattingRegex = /§[0-9a-fklmnor]+|[\[\]]+/g;
    return rawString.replace(formattingRegex, '');
}
class GuildMessage {
    message;
    sender;
    constructor(message, sender) {
        this.message = message;
        this.sender = sender;
    }
    getContent() {
        return this.message;
    }
    getSender() {
        return this.sender;
    }
}
class GuildMessageSender {
    rawUsername;
    rawHypixelRank;
    rawGuildRank;
    constructor(rawUsername, rawHypixelRank, rawGuildRank) {
        this.rawUsername = rawUsername;
        this.rawHypixelRank = rawHypixelRank;
        this.rawGuildRank = rawGuildRank;
    }
    getCleanUsername() {
        return cleanFormatting(this.rawUsername);
    }
    getCleanHypixelRank() {
        return cleanFormatting(this.rawHypixelRank);
    }
    getCleanGuildRank() {
        return cleanFormatting(this.rawGuildRank);
    }
    getRawUsername() {
        return this.rawUsername;
    }
    getRawHypixelRank() {
        return this.rawHypixelRank;
    }
    getRawGuildRank() {
        return this.rawGuildRank;
    }
}
class OfficerMessage extends GuildMessage {
    constructor(message, sender) {
        super(message, sender);
    }
}
export { GuildMessage, GuildMessageSender, OfficerMessage };
//# sourceMappingURL=eventTypes.js.map