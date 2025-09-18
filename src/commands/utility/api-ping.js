import { WebEmbed } from "discord.js-selfbot-v13";
import { discordStatus } from "../../modules/discord-status-main/src/index.js";
import {
    logger,
    logError,
    sleep
} from "../../utils.js";

let isRunning = false;

export default {
    data: {
        name: "api-ping",
        description: "Measure the response speed of the API."
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
            const result = await discordStatus.getStatus(args[0]);
            if (result.status === "error") {
                logger.error(result.message);
                logError(new Date(), `src/commands/api-ping.js ${result.message}`);
                const embed = new WebEmbed()
                .setColor("RED")
                .setTitle("ERROR")
                .setDescription(result.message);
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            } else {
                const embed = new WebEmbed()
                .setColor("PURPLE")
                .setTitle("🏓Pong!")
                .setDescription(`${Math.round(result.metrics[0].summary.mean)}ms`);
                await message.reactions.removeAll();
                await message.react("✅");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                await msg.delete();
                isRunning = false;
            }
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/api-ping.js ${e.message}`);
            const embed = new WebEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription(e.message);
            await message.reactions.removeAll();
            await message.react("❌");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(6 * 1000);
            await msg.delete();
            isRunning = false;
        } finally {
            isRunning = false;
        }
    }
};