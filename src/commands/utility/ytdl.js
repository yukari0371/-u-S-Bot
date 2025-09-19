import { WebEmbed } from "discord.js-selfbot-v13";
import ytdl from "@distube/ytdl-core";
import { 
    logger,
    logError,
    sleep,
    urlShortener
} from "../../utils.js";

let isRunning = false;

export default {
    data: {
        name: "ytdl",
        description: "Download YouTube videos."
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
                .setDescription("ytdl is running.");
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            await message.react("⌛");
            isRunning = true;
            const link = args[0];
            const info = await ytdl.getInfo(link);
            const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });
            const result = await urlShortener(format.url);
            if (result.status) {
                const embed = new WebEmbed()
                .setColor("PURPLE")
                .setTitle("DOWNLOAD LINK")
                .setDescription(`Title: ${info.videoDetails.title}\nDownload link: ${result.short_url}`)
                .setRedirect(result.short_url);
                await message.reactions.removeAll();
                await message.react("✅");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(30 * 1000);
                return await msg.delete();
            } else {
                logger.error(`${result.code} ${result.message}`);
                logError(new Date(), `src/commands/utility/ytdl.js ${result.code} ${result.message}`);
                const embed = new WebEmbed()
                .setColor("RED")
                .setTitle("ERROR")
                .setDescription(`${result.code} ${result.message}`);
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}}`);
                await sleep(6 * 1000);
                return await msg.delete();
            } 
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/utility/ytdl.js ${e.message}`);
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