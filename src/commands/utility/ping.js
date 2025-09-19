import { WebEmbed } from "discord.js-selfbot-v13";
import {
    sleep,
    logger,
    logError
} from "../../utils.js";

export default {
    data: {
        name: "ping",
        description: "Measure the response speed."
    },
    async execute(
        client,
        message,
        args
    ) {
        const embed = new WebEmbed()
        .setColor("PURPLE")
        .setTitle("🏓Ping!")
        .setDescription(`${client.ws.ping}ms`)
        const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`).catch(async(e) => {
            logger.error(e.message);
            logError(new Date(), `src/commands/utility/ping.js ${e.message}`);
            return await message.react("❌");
        });
        await sleep(6 * 1000);
        await msg.delete();
    }
}