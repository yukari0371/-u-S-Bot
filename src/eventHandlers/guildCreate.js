import fs from "fs";
import { logger } from "../utils.js";

export function handler(client) {
    client.on("guildCreate", async (guild) => {
        const time = new Date();
        fs.appendFileSync("data/logs/eventLogs/guildCreate.txt", `[${time}] Joined ${guild.name}(${guild.id})\n`, "utf-8");
        logger.event(`[${time}] Joined ${guild.name}(${guild.id})`);
    });
};