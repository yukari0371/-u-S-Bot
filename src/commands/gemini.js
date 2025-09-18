import { GoogleGenerativeAI } from "@google/generative-ai";
import { WebEmbed } from "discord.js-selfbot-v13";
import fs from "fs";
import {
    logger,
    logError,
    sleep
} from "../utils.js";

const apiKey = fs.readFileSync("data/db/geminiApiKey.txt", "utf-8");
const genAI = new GoogleGenerativeAI(apiKey);

let isRunning = false;

export default {
    data: {
        name: "gemini",
        description: "Talk to gemini."
    },
    async execute(
        client,
        message,
        args
    ) {
        try {
            await message.react("⌛");
            await message.channel.sendTyping();
            if (isRunning) {
                const embed = new WebEmbed()
                .setColor("YELLOW")
                .setTitle("WARNING")
                .setDescription("gemini is running.");
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            isRunning = true;

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = args.join(" ");
            if (prompt === "") {
                logger.error("The prompt is invalid.");
                logError(new Date(), `src/commands/gemini.js The prompt is invalid.`);
                await message.reactions.removeAll();
                await message.react("❌");
                const embed = new WebEmbed()
                .setColor("RED")
                .setTitle("ERROR")
                .setDescription("The prompt is invalid.");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            await message.reactions.removeAll();
            await message.react("✅");
            const msg = await message.reply(text);
            await sleep(30 * 1000);
            await msg.delete();
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/gemini.js ${e.message}`);
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