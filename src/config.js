import fs from "fs";

export default class ConfigHandler {
    constructor(configFilePath) {
        this.configFilePath = configFilePath;
        this.config = {};
        if (fs.existsSync(configFilePath)) {
            this.loadConfig();
        } else {
            this.createConfig();
        }
    }

    createConfig() {
        this.config = {
            email: '',
            version: 1
        };
        this.saveConfig();
    }

    loadConfig() {
        const configData = fs.readFileSync(this.configFilePath, 'utf8');
        this.config = JSON.parse(configData);
    }

    saveConfig() {
        fs.writeFileSync(this.configFilePath, JSON.stringify(this.config, null, 2), 'utf8');
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }
}