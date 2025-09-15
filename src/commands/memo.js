import { WebEmbed } from "discord.js-selfbot-v13";
import fs from "fs";
import path from "path";
import {
    logger,
    sleep,
    logError
} from "../utils.js";
const memoFilePath = path.resolve("data/db/memo.txt");

export default {
    data: {
        name: "memo",
        description: "Notepad management."
    },
    async execute(
        client,
        message,
        args
    ) {
        try {
            if (args) {
                await message.react("⌛");
                switch (args[0]) {
                    case "view":
                        const memoContents = fs.readFileSync(memoFilePath, "utf-8").split("\n").map(c => c.trim()).filter(c => c !== "");
                        const embed_view = new WebEmbed()
                        .setColor("PURPLE")
                        .setTitle("Memo View")
                        .setDescription(memoContents.join("\n----------\n"));
                        await message.reactions.removeAll();
                        await message.react("✅");
                        const msg_1 = await message.reply(`${WebEmbed.hiddenEmbed}${embed_view}`);
                        await sleep(30 * 1000);
                        await msg_1.delete();
                    break;
                    case "add":
                        const text = args.slice(1).join("");
                        if (text !== "") {
                            fs.appendFileSync(memoFilePath, `${text}\n`, "utf-8");
                            await message.reactions.removeAll();
                            await message.react("✅");
                        } else {
                            await message.reactions.removeAll();
                            await message.react("❌");
                            const embed_error_1 = new WebEmbed()
                            .setColor("LED")
                            .setTitle("ERROR")
                            .setDescription("The text you add must be at least one character long.");
                            await message.reply(`${WebEmbed.hiddenEmbed}${embed_error_1}`);
                            await sleep(6 * 1000);
                            await embed_error_1.delete();
                        }
                    break;
                    case "remove":
                        const row = Number(args[1]) - 1;
                        if (!isNaN(row)) {
                            const memoContents = fs.readFileSync(memoFilePath, "utf-8").split("\n").map(c => c.trim()).filter(c => c !== "");
                            if (row > 0 && !row < memoContents.length) {
                                const filteredMemoContents = memoContents.map(c => c.trim()).map((c, i) => ({ value: c, index: i })).filter(c => c.index !== row);
                                const memoContentOnly = filteredMemoContents.map(c => c.value);
                                fs.writeFileSync(memoFilePath, `${memoContentOnly.join("\n")}\n`, "utf-8");
                                await message.reactions.removeAll();
                                await message.react("✅");
                            } else {
                                const embed_error_3 = new WebEmbed()
                                .setColor("RED")
                                .setTitle("ERROR")
                                .setDescription("The specified rows must be zero or more and must exist.");
                                await message.reactions.removeAll();
                                await message.react("❌");
                                const msg_3 = await message.reply(`${WebEmbed.hiddenEmbed}${embed_error_3}`);
                                await sleep(6 * 1000);
                                await msg_3.delete();   
                            }
                        } else {
                            const embed_error_2 = new WebEmbed()
                            .setColor("RED")
                            .setTitle("ERROR")
                            .setDescription("The row is not specified or is not a valid number.");
                            await message.reactions.removeAll();
                            await message.react("❌");
                            const msg_2 = await message.reply(`${WebEmbed.hiddenEmbed}${embed_error_2}`);
                            await sleep(6 * 1000);
                            await msg_2.delete();
                        }
                    break;
                }
            }
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `memo.js ${e.message}`);
            const embed_error_4 = new WebEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription(e.message);
            await message.reactions.removeAll();
            await message.react("❌");
            const msg_4 = await message.reply(`${WebEmbed.hiddenEmbed}${embed_error_4}`);
            await sleep(6 * 1000);
            await msg_4.delete();
        }
    }
};