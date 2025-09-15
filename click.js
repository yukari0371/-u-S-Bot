import axios from "axios";

(async() => {
    while (true) {
        try {
            const res = await axios.get("https://dsc.gg/haesaba", {}, {
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "accept-encoding": "gzip, deflate, br, zstd",
                    "accept-language": "ja;q=0.9",
                    "priority": "u=0, i",
                    "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "cookie": "visited=true; cf_clearance=V1tzdDIezDlCPSonUlBb1RhJpBw5qRgbj4kvfkYDrro-1746626231-1.2.1.1-GC829sVNfT3_fXA7Z_bWrfoalxUl3e7on.d6uMnRG2PYjMQDRS7vHAR2Fn.jLWFLf53hvL1dsx4rt9bCddruO25bkjlQ3Z2xMLaOHt4YMomMliGwElvVHt6GUETS863LTlonnq8Ky.yDrb2o7BXcAWB7IWY_79.IX6TjT.98DvHTR2oUr3TpmplYgwmP9R4xSlRtSPb1s64tALFJV544SYIr8LdeeMAPmyPHQI7tJ9fZc1V0_0heSXnii8mdCqEkzRMMhB6qk6n.z2XbBy4juM3kEZvYb9vNKy3aAAXzgMb64HZI815kXdgutwAnHGjWEBJJ1RewYmM52qdJy9jEM6PIWXAVzZ56j.RfT.c5.zE",
                    "sec-fetch-user": "?1",
                    "sec-gpc": 1,
                    "upgrade-insecure-requests": 1,
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
                }
            });
            if (res.status === 200) {
                console.log("✓ success");
            } else {
                console.log("× Failed");
            } 
        } catch (e) {
            console.error("Error:", e);
        }
    }
})();