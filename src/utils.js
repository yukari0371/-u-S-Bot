import fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";
import { spawn } from "child_process";

const colors = {
    white: "\x1b[37m",
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    magenta: '\x1b[35m',
    orange: '\x1b[33m',
    reset: '\x1b[0m'
};

export const logger = {

    info: (message) => {
        console.log(`[${colors.blue}INFO${colors.white}] ${message}`);
    },

    warn: (message) => {
        console.log(`[${colors.yellow}WARN${colors.white}] ${message}`);
    },

    error: (message) => {
        console.log(`[${colors.red}ERROR${colors.white}] ${message}`);
    },

    success: (message) => {
        console.log(`[${colors.green}SUCCESS${colors.white}] ${message}`);
    },

    debug: (message) => {
        console.log(`[${colors.magenta}DEBUG${colors.white}] ${message}`);
    },

    event: (message) => {
        console.log(`[${colors.orange}EVENT${colors.white}] ${message}`);
    }
};

export async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
};

export function logError(time, message) {
    fs.appendFileSync("data/logs/error.txt", `[${time}] ${message}\n`, "utf-8");
};

export function jumpLink(link) {
    const jumpLink = `\u001b]8;;${link}]8;;\u0007`;
    return jumpLink;
};

export function toJsLiteral(obj) {
    if (Array.isArray(obj)) {
        return obj.map(toJsLiteral).join(", ");
    } else if (typeof obj === "object" && obj !== null) {
        const entries = Object.entries(obj).map(([k, v]) => {
            if (typeof v === "string") {
                const safeText = v.replace(/\n/g, "\\n").replace(/"/g, '\\"');
                return `${k}: "${safeText}"`;
            }
            if (Array.isArray(v)) return `${k}: [${toJsLiteral(v)}]`;
            if (typeof v === "object") return `${k}: { ${toJsLiteral(v)} }`;
            return `${k}: ${v}`;
        });
        return `{ ${entries.join(", ")} }`;
    }
    return obj;
};

export async function urlShortener(url) {
    const res = await axios.post("https://short-link.me/interstitial-form/ja/", {
        url: url
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
            "Origin": "https://short-link.me",
            "Referer": "https://short-link.me/interstitial-form/ja/"
        }
    });
    if (res.status === 200) {
        const $ = cheerio.load(res.data);
        const short_url = $("body > section > div > div > section.link-section > input").val();
        return {
            status: true,
            short_url: short_url
        }
    } else {
        return {
            status: false,
            code: res.status,
            message: res.statusText
        }
    }
};

export function restart() {
    process.exit(0);
};

export function shutdown() {
    process.exit(1);
}