const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;

const bot = new TelegramBot(token, { polling: true });

/* START MENU */
bot.onText(/\/start/, (msg) => {

    const options = {
        reply_markup: {
            keyboard: [
                ["💼 Work Status"],
                ["💰 Payment Status"],
                ["📤 Submit Proof"]
            ],
            resize_keyboard: true
        }
    };

    bot.sendMessage(msg.chat.id, "👋 Welcome!\n\nSelect an option below:", options);
});

/* WORK STATUS */
bot.onText(/💼 Work Status/, (msg) => {
    bot.sendMessage(msg.chat.id, "📊 Your work status is currently active.");
});

/* PAYMENT STATUS */
bot.onText(/💰 Payment Status/, (msg) => {
    bot.sendMessage(msg.chat.id, "💵 Your payment is under review.");
});

/* SUBMIT PROOF BUTTON */
bot.onText(/📤 Submit Proof/, (msg) => {
    bot.sendMessage(msg.chat.id, "📸 Please send your proof screenshot now.");
});

/* PROOF FORWARD SYSTEM */
bot.on('message', async (msg) => {

    if (msg.text === "/start") return;
    if (msg.text === "💼 Work Status") return;
    if (msg.text === "💰 Payment Status") return;
    if (msg.text === "📤 Submit Proof") return;

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

/* APPROVE / REJECT SYSTEM */
bot.on('callback_query', (query) => {

    const data = query.data.split("_");
    const action = data[0];
    const userId = data[1];

    if (query.message.chat.id.toString() === adminId) {

        if (action === "approve") {
            bot.sendMessage(userId, "✅ Your proof has been approved.");
        }

        if (action === "reject") {
            bot.sendMessage(userId, "❌ Your proof has been rejected.");
        }

        bot.answerCallbackQuery(query.id);
    }
});

console.log("Bot Running...");
