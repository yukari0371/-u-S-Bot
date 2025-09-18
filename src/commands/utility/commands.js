import { WebEmbed } from "discord.js-selfbot-v13";
import fs from "fs";
import {
    logger,
    logError,
    sleep
} from "../../utils.js";
let isRunning = false;

export default {
    data: {
        name: "commands",
        description: "Command list"
    },
    async execute(
        client,
        message,
        args
    ) {
        try {
            await message.react("⌛");
            if (isRunning) {
                const embed = new WebEmbed()
                .setColor("YELLOW")
                .setTitle("WARNING")
                .setDescription("avatar is running.");
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            isRunning = true;
            const commandList = fs.readFileSync("data/db/commandList.txt", "utf-8").split("\n").filter(c => c !== "").map(c => c.trim());
            await message.reactions.removeAll();
            await message.react("✅");
            const msg = await message.reply({
                content: "Command list",
                files: ["data/db/commandList.txt"]
            });
            await sleep(30 * 1000);
            await msg.delete();
        } catch (e) {
            const embed = new WebEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription(e.message);
            logger.error(e.message);
            logError(new Date(), `src/commands/commands.js ${e.message}`);
            await message.reactions.removeAll();
            await message.react("❌");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(6 * 1000);
            await msg.delete();
        } finally {
            isRunning = false;
        }
    }
};