import fs from "fs";
import {
    logger,
    logError,
    sleep,
    restart
} from "../../utils.js";

let isRunning = false;

export default {
    data: {
        name: "change-prefix",
        description: "change prefix."
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
                .setDescription("change-prefix is running. (restart)");
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            isRunning = true;
            const newPrefix = args[0];
            fs.writeFileSync("data/db/prefix.txt", newPrefix, "utf-8");
            await message.reactions.removeAll();
            await message.react("✅");
            await sleep(6 * 1000);
            await message.delete();
            restart();
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