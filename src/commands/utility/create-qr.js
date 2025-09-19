import { WebEmbed } from "discord.js-selfbot-v13";
import {
    logger,
    logError,
    sleep
} from "../../utils.js";

let isRunning = false;

export default {
    data: {
        name: "create-qr",
        description: "create qr."
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
                .setDescription("create-qr is running.");
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            isRunning = true;
            const c = args[0];
            const embed = new WebEmbed()
            .setColor("PURPLE")
            .setTitle("RESULT")
            .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${c}`);
            await message.reactions.removeAll();
            await message.react("✅");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(30 * 1000);
            await msg.delete();
        } catch (e) {
            const embed = new WebEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription(e.message);
            logger.error(e.message);
            logError(new Date(), `src/commands/create-qr.js ${e.message}`);
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