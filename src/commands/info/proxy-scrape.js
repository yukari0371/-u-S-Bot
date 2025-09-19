import { WebEmbed } from "discord.js-selfbot-v13";
import fs from "fs/promises";
import axios from "axios";
import * as cheerio from "cheerio";
import {
    sleep,
    logger,
    logError
} from "../../utils.js";

let isRunning = false;

export default {
    data: {
        name: "proxy-scrape",
        description: "Scrape proxy."
    },
    async execute(
        client,
        message,
        args
    ) {
        const proxyType = args[0];

        if (isRunning) {
            const embed = new WebEmbed()
            .setColor("YELLOW")
            .setTitle("WARNING")
            .setDescription("proxy-scraper is running.");
            await message.reactions.removeAll();
            await message.react("❌");
            const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
            await sleep(6 * 1000);
            return await msg.delete();
        }

        await message.react("⌛");
        isRunning = true;

        try {
            const pages = Array.from({ length: 100 }, (_, index) => index + 1);
            const proxies = [];
    
            for (const page of pages) {
                const response = await axios.get(`https://www.freeproxy.world/?type=${proxyType}&anonymity=&country=&speed=&port=&page=${page}`);
                if (response.status === 200) {
                    const $ = cheerio.load(response.data);
                    // exceeded maximum page.
                    if (!$("tr")) break;
                    $("tr").each((index, element) => {
                        const host = $(element).find("td[class='show-ip-div']").text();
                        if (!host) return;
                        let linkStartsWith = "";
                        if (proxyType === "http" || proxyType === "https") linkStartsWith = "http://";
                        if (proxyType === "socks4" || proxyType === "socks5") linkStartsWith = "socks://";
                        const port = $(element).find("td a:eq(0)").text();
                        const proxy = `${linkStartsWith}${host.trim()}:${port.trim()}`;
                        proxies.push(proxy);
                    });
                } else {
                    logger.error(`${response.status} ${response.statusText}`);
                    logError(new Date(), `src/commands/info/proxy-scrape.js ${response.status} ${response.statusText}`);
                    await message.reactions.removeAll();
                    await message.react("❌");
                    const embed = new WebEmbed()
                    .setColor("RED")
                    .setTitle("ERROR")
                    .setDescription(response.statusText);
                    const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                    await sleep(6 * 1000);
                    return await msg.delete();
                }
            }
    
            try {
                await message.reactions.removeAll();
                await message.react("✅");
                await fs.writeFile(`data/tmp/${proxyType}.txt`, proxies.join("\n"), "utf-8");
                const msg = await message.reply({
                    content: "Successfully!",
                    files: [`data/tmp/${proxyType}.txt`],
                });
                await sleep(30 * 1000);
                await msg.delete();
            } catch (e) {
                logger.error(e.message);
                logError(new Date(), `src/commands/info/proxy-scrape.js ${e.message}`);
                await message.reactions.removeAll();
                await message.react("❌");
                const embed = new WebEmbed()
                .setColor("RED")
                .setTitle("ERROR")
                .setDescription(e.message);
                const msg = await message.reply(`${WebEmbed.hiddenEmbed}${embed}`);
                await sleep(6 * 1000);
                await msg.delete();
            }
        } catch (e) {
                logger.error(e.message);
                logError(new Date(), `src/commands/info/proxy-scrape.js ${e.message}`);
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