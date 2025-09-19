import { WebEmbed } from "discord.js-selfbot-v13";
import wiki from "wikipedia";
import {
    logError,
    logger,
    sleep
} from "../../utils.js";

let isRunning = false;

export default {
    data:{
        name: "wikipedia",
        description: "Search Wikipedia."
    },
    async execute(
        client,
        message,
        args
    ) {
        const keyword = args.join("");

        if (isRunning) {
            const embed = new WebEmbed()
            .setColor("YELLOW")
            .setTitle("WARNING")
            .setDescription("wikipedia is running.");
            await message.reactions.removeAll();
            await message.react("❌");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(6 * 1000);
            return await msg.delete();
        }

        await message.react("⌛");

        try {
            wiki.setLang("ja");
            const page = await wiki.page(keyword);
            const summary = await page.summary();
            let imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";
            if (summary.thumbnail) imageUrl = summary.thumbnail.source;
            //console.log(summary);
            const embed_1 = new WebEmbed()
            .setColor("PURPLE")
            .setTitle(`${keyword} search results`)
            .setDescription(`
・Title
 ┗${summary.title ? summary.title : "Unknown"}
・Description
 ┗${summary.description ? summary.description : "Unknown"}
・Extract
 ┗${summary.extract ? summary.extract : "Unknown"}
`)
            .setImage(imageUrl);
            await message.reactions.removeAll();
            await message.react("✅");
            const msg_1 =await message.reply(`${embed_1}`);
            await sleep(30 * 1000);
            await msg_1.delete();
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/info/wikipedia.js ${e.message}`);
            const embed_2 = new WebEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription("No search results found.");
            await message.reactions.removeAll();
            await message.react("❌");
            const msg_2 =  await message.reply(`${WebEmbed.hiddenEmbed}${embed_2}`);
            await sleep(6 * 1000);
            await msg_2.delete();
        } finally {
            isRunning = false;
        }
    }
};