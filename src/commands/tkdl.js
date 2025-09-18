import { WebEmbed } from "discord.js-selfbot-v13";
import Tiktok from "@tobyg74/tiktok-api-dl";
import {
    sleep,
    logger,
    logError,
    urlShortener
} from "../utils.js";

let isRunning = false;

export default {
    data: {
        name: "tkdl",
        description: "Download TikTok videos."
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
                .setDescription("tkdl is running.");
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            await message.react("⌛");
            isRunning = true;
            const link = args[0];
            const result = await Tiktok.Downloader(link, {
                version: "v3"
            });
            if (result.status === "success") {
                const _result = await urlShortener(result.result.videoHD);
                if (_result.status) {
                    const embed = new WebEmbed()
                    .setColor("PURPLE")
                    .setTitle("DOWNLOAD LINK")
                    .setDescription(`${result.result.desc} by ${result.result.author.nickname}\nDownload link: ${_result.short_url}`)
                    .setVideo(result.result.videoHD)
                    .setRedirect(result.short_url);
                    await message.reactions.removeAll();
                    await message.react("✅");
                    const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                    await sleep(30 * 1000);
                    return await msg.delete();
                } else {
                    logger.error(`${_result.code} ${_result.message}`);
                    logError(new Date(), `src/commands/tkdl.js ${_result.code} ${_result.message}`);
                    const embed = new WebEmbed()
                    .setColor("RED")
                    .setTitle("ERROR")
                    .setDescription(`${_result.code} ${_result.message}`);
                    await message.reactions.removeAll();
                    await message.react("❌");
                    const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}}`);
                    await sleep(6 * 1000);
                    return await msg.delete();
                }
            } else {
                logger.error(e.message);
                logError(new Date(), `src/commands/tkdl.js ${e.message}`);
                await message.reactions.removeAll();
                await message.react("❌");
                const embed = new WebEmbed()
                .setColor("RED")
                .setTitle("ERROR")
                .setDescription("Failed to retrieve video.");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                await msg.delete();
                isRunning = false;
                }
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/tkdl.js ${e.message}`);
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
}