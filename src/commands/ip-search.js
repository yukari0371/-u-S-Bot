import { WebEmbed } from "discord.js-selfbot-v13";
import * as cheerio from "cheerio";
import axios from "axios";
import {
    logger,
    sleep,
    logError
} from "../utils.js";

let isRunning = false;

export default {
    data: {
        name: "ip-search",
        description: "Find IP address addresses."
    },
    async execute(
        client,
        message,
        args
    ) {
        const ipAddress = args[0];

        const embed_error = new WebEmbed()
        .setColor("RED")
        .setTitle("ERROR")
        .setDescription("Search failed.");

        if (isRunning) {
            const embed = new WebEmbed()
            .setColor("YELLOW")
            .setTitle("WARNING")
            .setDescription("IP address addresses searcher is running.");
            await message.reactions.removeAll();
            await message.react("❌");
            const msg_1 = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(6 * 1000);
            return await msg_1.delete();
        }

        await message.react("⌛");
        isRunning = true;

        try {
            let cookie;
            let tokenId;
            let token;

            const response = await axios.get("https://rakko.tools/tools/11/");
            if (response.status === 200) {
                cookie = (response.headers["set-cookie"] || []).map(c => c.split(";")[0]).join("; ");
                const $ = cheerio.load(response.data);
                const scripts = $("head > script").toArray();
                let tokensScript = null;

                for (const s of scripts) {
                    const text = $(s).text();
                    if (text.includes("tokenId")) {
                        tokensScript = text;
                        break;
                    }

                    if (!tokensScript) {
                        logger.error("Token script not found.");
                    }
                }

                logger.info(tokensScript);

                tokenId = tokensScript.split("'")[1];
                token = tokensScript.split("'")[3];
            } else {
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed_error}`);
                await sleep(6 * 1000);
                return await msg.delete();
            }
            logger.info(tokenId);
            logger.info(token);
            logger.info(ipAddress);

            const payload = new URLSearchParams({
                token_id: tokenId,token: token,
                data: ipAddress
            }).toString();

            const response_1 = await axios.post(
                "https://rakko.tools/tools/11/locationController.php",
                payload,
                {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "origin": "https://rakko.tools",
                        "referer": "https://rakko.tools/tools/11/",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                        "x-requested-with": "XMLHttpRequest",
                        "cookie": cookie
                    }
                }
            );
            if (response_1.status === 200) {
                const info = response_1.data.data.info;
                const hostname = info.hostName ?? "Unknown";
                let country = info.country ?? "Unknown";
                country = country.match(/<span class="country_name">(.*?)<\/span>/);
                country = country ? country[1]: "Unknown";
                const city = info.citry;
                const postAddress = info.postAddress;
                const coordinate = info.coordinate;

                const embed = new WebEmbed()
                .setColor("PURPLE")
                .setTitle("Search results")
                .setDescription(`
・IP Address
 ┗${ipAddress ? ipAddress : "Unknown"}
・Host name
 ┗${hostname ? hostname : "Unknown"}
・Country
 ┗${country ? country : "Unknown"}
・City
 ┗${city ? city : "Unknown"}
・Post address
 ┗${postAddress ? postAddress : "Unknown"}
・Coordinate
 ┗${coordinate ? coordinate : "Unknown"}
`)
                await message.reactions.removeAll();
                await message.react("✅");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(30 * 1000);
                await msg.delete();
            } else {
                logger.error(`${response_1.status} ${response_1.statusText}`);
                logError(new Date(), `src/commands/ip-search.js ${response_1.status} ${response_1.statusText}`)
                await message.reactions.removeAll();
                await message.react("❌");
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed_error}`);
                await sleep(6 * 1000);
                await msg.delete();
            }
        } catch (e) {
            const embed = new WebEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription(e.message);
            logger.error(e.message);
            logError(new Date(), `src/commands/ip-search.js ${e.message}`);
            await message.reactions.removeAll();
            await message.react("❌");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(6 * 1000);
            await msg.delete();
        } finally {
            isRunning = false;
        }
    }
};