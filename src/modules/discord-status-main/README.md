# discord-status
Get information about discord status.
### Usage
```ts
import { discordStatus } from "..";

(async() => {
    await discordStatus.getStatus().then((result) => {
        if (result.status === "error") {
            return console.error("Error:", result.message);
        }
        console.log(result));
    }).catch((error) => {
        if (error instanceof Error) {
            return console.error("Error", error.message);
        }
    });
})();
```

### Result
```
{
  status: 'success',
  period: {
    count: 288,
    interval: 300,
    identifier: 'day'
    },
    metrics: [
        {
            metric: [Object],
            summary: [Object],
            data: [Array]
        }
    ]
}
```
