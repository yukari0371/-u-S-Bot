import {
    logger,
    logError
} from "../../utils.js";

export default {
    data: {
        name: "cmu",
        description: "Clears the specified user's messages from the specified channel."
    },
    async execute(
        client,
        message,
        args
    ) {
        const TARGET_USER_ID = args[0];
        const TARGET_CHANNEL_ID = args[1];
        try {
            const channel = await client.channels.fetch(TARGET_CHANNEL_ID);
            let totalDeleted = 0;
            let lastMessageId = null;
            while (true) {
                const fetched = await channel.messages.fetch({ 
                    limit: 100, 
                    before: lastMessageId
                });
                if (fetched.size === 0) break;
                const messagesToDelete = fetched.filter(msg => msg.author.id === TARGET_USER_ID);
                for (const msg of messagesToDelete.values()) {
                    await msg.delete();
                    totalDeleted++;
                    logger.info(`Deleted message ID: ${msg.id}`);
                }
                lastMessageId = fetched.last().id;
            }
            console.log(`ユーザー <@${TARGET_USER_ID}> のメッセージを ${totalDeleted}件 削除しました。`);
        } catch (error) {
            logger.error(error.message);
            logError(new Date(), `src/commands/cmu.js ${error.message}`);
            await message.react("❌");
        }
    }
};