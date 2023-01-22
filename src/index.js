const TelegramBot = require("node-telegram-bot-api");
const Tgfancy = require("tgfancy");
const { dateSubs, nextDay } = require("./helper");

const DB = require("./mongoDb/index");

require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const newBot = new Tgfancy(token, {
  tgfancy: {
    option: "value",
  },
});

bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (userId === 382298066) {
      await bot.sendMessage(chatId, "kiker bot запущений");

      setInterval(async () => {
        const dbUser = await DB.checkUserDate();
        dbUser.forEach(async (user) => {
          if (user.payment.dateEnd === null) {
            return;
          } else if (
            user.payment.dateEnd === nextDay() &&
            user.deleteDate === null
          ) {
            DB.deletePostDate(user.user_id, nextDay);
            newBot.kickChatMember(chatId, user.user_id);
          }
        });
      }, 10800000);
    }
  } catch (error) {
    console.error(error);
  }
});
