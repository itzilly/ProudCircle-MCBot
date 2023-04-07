import fs from "fs";

export default class ConfigHandler {
    private readonly configFilePath: string;
    private config: object;

    constructor(configFilePath) {
        this.configFilePath = configFilePath;
        this.config = {};
        if (fs.existsSync(configFilePath)) {
            this.loadConfig();
        } else {
            this.createConfig();
        }
    }

    private createConfig() {
        this.config = {
            email: '',
            webhook_url: '',
            version: 2
        };
        this.saveConfig();
    }

    private loadConfig() {
        const configData = fs.readFileSync(this.configFilePath, 'utf8');
        this.config = JSON.parse(configData);
    }

    private saveConfig() {
        fs.writeFileSync(this.configFilePath, JSON.stringify(this.config, null, 2), 'utf8');
    }

    public get(key) {
        return this.config[key];
    }


    public set(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }
}