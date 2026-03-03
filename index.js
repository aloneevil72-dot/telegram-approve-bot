const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    if (msg.chat.id.toString() !== adminId) {

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Approve ✅", callback_data: "approve_" + msg.chat.id },
                        { text: "Reject ❌", callback_data: "reject_" + msg.chat.id }
                    ]
                ]
            }
        };

        bot.sendMessage(adminId,
            `📩 New Proof Received\nUser ID: ${msg.chat.id}`,
            options
        );

        bot.forwardMessage(adminId, msg.chat.id, msg.message_id);
    }
});

bot.on('callback_query', (query) => {

    const data = query.data.split("_");
    const action = data[0];
    const userId = data[1];

    if (query.message.chat.id.toString() === adminId) {

        if (action === "approve") {
            bot.sendMessage(userId, "✅ Your proof has been approved.");
            bot.answerCallbackQuery(query.id, { text: "Approved ✅" });
        }

        if (action === "reject") {
            bot.sendMessage(userId, "❌ Your proof has been rejected.");
            bot.answerCallbackQuery(query.id, { text: "Rejected ❌" });
        }
    }
});

console.log("Bot Running...");
