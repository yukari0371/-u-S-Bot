import { WebEmbed } from "discord.js-selfbot-v13";
import whois from "whois";
import fs from "fs";
import { logError } from "../../utils.js";

let isRunning = false;

export default {
    data: {
        name: "whois",
        description: "Get the whois information of the target."
    },
    async execute(
        client,
        message,
        args
    ) {
        const targetDomain = args[0];

        if (isRunning) {
            const embed_1 = new WebEmbed()
            .setColor("YELLOW")
            .setTitle("WARNING")
            .setDescription("whois is running.");
            await message.reactions.removeAll();
            await message.react("❌");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed_1}`);
            await sleep(6 * 1000);
            return await msg.delete();
        }

        await message.react("⌛");
        isRunning = true;

        whois.lookup(targetDomain, async function(_, data) {
            try {
                fs.writeFileSync("data/tmp/whois.txt", data, "utf-8");
                await message.reactions.removeAll();
                await message.react("✅");
                const msg = await message.reply({
                    content: "✓ Successfully!",
                    files: ["data/tmp/whois.txt"],
                    ephemeral: true
                });
                 await sleep(30 * 1000);
                await msg.delete();
            } catch (e) {
                logger.error(e.message);
                logError(new Date(), `src/commands/info/whois.js ${e.message}`);
                await message.reactions.removeAll();
                await message.react("❌");
                const embed_2 = new WebEmbed()
                .setColor("RED")
                .setTitle("ERROR")
                .setDescription(e.message);
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed_2}`);
                await sleep(6 * 1000);
                await msg.delete();
            } finally {
                isRunning = false;
            }
        });
    }
};