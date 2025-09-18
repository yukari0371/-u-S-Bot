import { WebEmbed } from "discord.js-selfbot-v13";
import {
    logger,
    logError,
    urlShortener,
    sleep
} from "../../utils.js";

let isRunning = false;

export default {
    data: {
        name: "link-short",
        description: "Shorten the link."
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
                .setDescription("link-short is running.");
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            await message.react("⌛");
            isRunning = true;
            const link = args[0];
            const result = await urlShortener(link);
            if (result.status) {
                const embed = new WebEmbed()
                .setColor("PURPLE")
                .setTitle("SHORTED LINK")
                .setRedirect(result.short_url)
                .setDescription(`Shorted link: ${result.short_url}`);
                await message.reactions.removeAll();
                await message.react("✅");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(30 * 1000);
                await msg.delete();
            } else {
                logger.error(`${result.code} ${result.message}`);
                logError(new Date(), `src/commands/link-short.js ${result.code} ${result.message}`);
                await message.reactions.removeAll();
                await message.react("❌");
                const embed = new WebEmbed()
                .setColor("RED")
                .setTitle("ERROR")
                .setDescription(`${result.code} ${result.message}`);
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/link-short.js ${e.message}`);
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