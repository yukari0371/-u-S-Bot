import fs from "fs";
import { logger } from "../utils.js";

export function handler(client) {
    client.on("guildBanAdd", async (ban) => {
        const { guild, user } = ban;
        if (user.id === client.user.id) {
            const time = new Date();
            fs.appendFileSync("data/logs/eventLogs/guildBanAdd.txt", `[${time}] Banned from ${guild.name}(${guild.id})\n`, "utf-8");
            logger.event(`[${time}] Banned from ${guild.name}(${guild.id})`);
        }
    });
};