import { WebEmbed } from "discord.js-selfbot-v13";
import { sleep } from "../../utils.js";

export default {
    data: {
        name: "nuke",
        description: "Recreate channel."
    },
    async execute(
        client,
        message,
        args
    ) {
        try {
            await message.channel.clone().then(async clonedChannel => {
                await message.channel.delete();
                const embed = new WebEmbed()
                .setColor("PURPLE")
                .setTitle(`💣NUKED BY ${message.author.tag}`)
                .setDescription("✓ Successfully recreated.");
                const msg = await clonedChannel.send(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                await msg.delete();
            });
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/dev/nuke.js ${e.message}`);
            const embed = new WebEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription(e.message);
            await message.reactions.removeAll();
            await message.react("❌");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(6 * 1000);
            await msg.delete();
        }
    }
};