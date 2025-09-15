import fs from "fs";
import { logger } from "../utils.js";

export function handler(client) {
    client.on("messageDelete", async (message) => {
        if (!message || !message.author) return;
        const prefix = fs.readFileSync("data/db/prefix.txt", "utf-8");
        if (message.content.startsWith("https://webembed-sb.onrender.com/embed?") || message.content.startsWith(prefix.trim()) || message.content.includes(`||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||`)) return;
        if (client.user.id === message.author.id) {
            fs.appendFileSync("data/logs/eventLogs/messageDelete.txt", `[${new Date()}] Deleted message | Sender ${message.author.tag}(${message.author.id}) | Msg ${message.content}(${message.id})\n`, "utf-8");
            logger.event(`[${new Date()}] Deleted message | Sender ${message.author.tag}(${message.author.id}) | Msg ${message.content}(${message.id})`);
        }
    });
};