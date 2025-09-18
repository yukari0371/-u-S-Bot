"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = void 0;
const axios_1 = __importDefault(require("axios"));
/** Functions */
const json_1 = __importDefault(require("../contents/json"));
/**
 * Get information about discord status.
 * @returns {Promise<getStatusResult>} - Discord status results.
 */
const getStatus = (type) => __awaiter(void 0, void 0, void 0, function* () {
    let url = "";
    switch (type) {
        case "day":
            url = json_1.default.status.day;
            break;
        case "week":
            url = json_1.default.status.week;
            break;
        case "month":
            url = json_1.default.status.month;
            break;
        default:
            return { status: "error", message: "Invalid type" };
    }
    try {
        const response = yield axios_1.default.get(url, {
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br, zstd",
                "accept-language": "ja;q=0.8",
                "if-none-match": "W/\"01560235c968412f5eb97e0c06698011\"",
                "priority": "u=1, i",
                "referer": "https://discordstatus.com/",
                "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Brave\";v=\"133\", \"Chromium\";v=\"133\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "Windows",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": 1,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
                "x-requested-with": "XMLHttpRequest"
            }
        });
        if (response.status !== 200) {
            return { status: "error", message: response.statusText };
        }
        const resData = response.data;
        // resDataがundefinedまたは期待値じゃない場合の安全チェック
        if (!resData || !resData.period || !resData.metrics) {
            return { status: "error", message: "Failed to fetch metrics or period" };
        }
        return {
            status: "success",
            period: resData.period,
            metrics: resData.metrics
        };
    }
    catch (e) {
        return { status: "error", message: e.message };
    }
});
exports.getStatus = getStatus;
