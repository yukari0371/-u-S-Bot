import {
    shutdown,
    logger,
    logError,
    sleep
} from "../../utils.js";
import { MessageActionRow, WebEmbed } from "discord.js-selfbot-v13";

let isRunning = false;

export default {
    data: {
        name: "shutdown",
        description: "shutdown bot."
    },
    async execute(
        client,
        message,
        args
    ) {
        try {
            if (isRunning) {
                const embed = new WebEmbed()
                .setColor("YELLOW")
                .setTitle("WARNING")
                .setDescription("shutdown is running.");
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            isRunning = true;
            const msg = await message.reply("shutdown...");
            await sleep(3 * 1000);
            await msg.delete();
            await message.delete();
            shutdown();
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/dev/shutdown.js ${e.message}`);
            await message.reactions.removeAll();
            await message.react("❌");
            const embed = new WebEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription(e.message);
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(6 * 1000);
            await msg.delete();
        } finally {
            isRunning = false;
        }
    }
};