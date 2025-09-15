import fs from "fs";

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
}