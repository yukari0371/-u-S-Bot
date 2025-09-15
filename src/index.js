import { Client, Collection } from "discord.js-selfbot-v13";
import {
    sleep,
    logger,
    logError
} from "./utils.js";
import pfs from "fs/promises";
import fs from "fs";
import path from "path";

const client = new Client({ checkupdate: false });
const token = fs.readFileSync("data/db/token.txt", "utf-8");
const prefix = fs.readFileSync("data/db/prefix.txt", 'utf-8');

process.on("uncaughtException", (e) => {
    logger.error(e.message);
    logError(new Date(), e.message);
});

client.once("ready", async() => {
    logger.info(`Logged in as: ${client.user.tag}`);
    let operatingHours = 0;
    let count = 0;
    setInterval(() => { count++; operatingHours++; }, 1000);
    setInterval(() => {
            fs.writeFileSync("data/db/operatingHours.txt", `${operatingHours}`, "utf-8");
    }, 1000);
});

const eventHandleFiles = fs.readdirSync("./src/eventHandlers").filter(file => file.endsWith(".js"));

for (const file of eventHandleFiles) {
    const filePath = path.resolve(`./src/eventHandlers/${file}`);
    const eventHandleFIle = await import(`file://${filePath}`);
    eventHandleFIle.handler(client);
    logger.success(`Set ${file}`);
}

client.commands = new Collection();
    
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));
    
for (const file of commandFiles) {
    const filePath = path.resolve(`./src/commands/${file}`);
    const command = await import(`file://${filePath}`);
    if (command.default && command.default.data.name) {
        client.commands.set(command.default.data.name, command.default);
        logger.success(`Set ${command.default.data.name}`);
    } else {
        logger.error(`Error loading command at ${filePath}: Missing name or default export`);
    }
}


client.on("messageCreate", async message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;

    let ops = await pfs.readFile("data/db/operator.txt", "utf-8");
    ops = ops.split("\n").map(op => op.trim()).filter(op => op !== "");
    if (!ops.includes(message.author.id)) return;
    
    try {
        await command.execute(
            client,
            message,
            args
        );
    } catch (e) {
        logger.error(e.message);
        await message.reply("There was an error while executing this command!");
    } finally {
        if (message.author.id === "1318935683888320683") {
            await sleep(6000);
            await message.delete();
        }
    }
});

client.login(token);