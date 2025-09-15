import fs from "fs";
import { logger } from "../utils.js";

export function handler(client) {
    client.on("guildDelete", async (guild) => {
        const time = new Date();
        fs.appendFileSync("data/logs/eventLogs/guildDelete.txt", `[${time}] Left from ${guild.name}(${guild.id})\n`, "utf-8");
        logger.event(`[${time}] Left from ${guild.name}(${guild.id})`);
    });
};