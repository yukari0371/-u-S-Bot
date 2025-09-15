import {
    logger,
    sleep,
    logError,
    jumpLink
} from "../utils.js";
import { WebEmbed } from "discord.js-selfbot-v13";
import * as cheerio from "cheerio";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
export default {
    data: {
        name: "avatar",
        description: "get avatar."
    },
    async execute(
        client,
        message,
        args
    ) {
        try {
            await message.react("⌛");
            const user = client.users.cache.get(args[0]);
            const avatarUrl = await user.displayAvatarURL();
            let imageUrl;
            const res_1 = await axios.get(avatarUrl, { responseType: "arraybuffer" });
            fs.writeFileSync("data/tmp/avatar.webp", res_1.data, "binary");
            const res_2 = await axios.get("https://freeimage.host");
            let auth_token;
            let cookie;
            if (res_2.status === 200) {
                cookie = (res_2.headers["set-cookie"]);
                const $ = cheerio.load(res_2.data);
                const scriptData = $("#index > script:nth-child(12)").text();
                auth_token = scriptData.split('"')[35].trim();
                logger.info(scriptData);
                logger.info(auth_token);
            } else {
                logger.error(`${res_2.status} ${res_2.statusText}`);
                await message.reactions.removeAll();
                await message.react("❌");
            }
            const form = new FormData();
            form.append("source", fs.createReadStream("data/tmp/avatar.webp"));
            form.append("type", "file");
            form.append("action", "upload");
            form.append("timestamp", Date.now());
            form.append("auth_token", auth_token);
            const res_3 = await axios.post("https://freeimage.host/json", form, {
                headers: form.getHeaders()
            });
            if (res_3.status === 200) {
                imageUrl = res_3.data.image.url;
            } else {
                logger.error(`${res_3.status} ${res_3.statusText}`);
                await message.reactions.removeAll();
                await message.react("❌");
            }
            await sleep(3 * 1000);
            const embed = new WebEmbed()
            .setColor("PURPLE")
            .setImage(imageUrl)
            .setTitle(`${user.tag}'s avatar`);
            await message.reactions.removeAll();
            await message.react("✅");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(10 * 1000);
            await msg.delete();
        } catch (e) {
            logger.error(e.message);
            logError(new Date(), `src/commands/avatar.js ${e.message}`);
            await message.react("❌");
        }
    }
};