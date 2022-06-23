const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TOKEN);
const chatID = '-1001630083102'

bot.start(ctx => {
  ctx.reply("Hello! I will start reminding you to read your Bible at different times of the day, and check if you have done it by 8pm!\nBot coded by Sean 🤩");
})

let time = new Date().getHours()

if (time == 11 || time == 15 ) {
  bot.telegram.sendMessage(chatID, "This is a reminder for you to read your Bible if you haven't!");
}

if (time == 20) {
  bot.telegram.sendPoll(chatID, 'Have you read your Bible today?', ['Yes', 'No'])
}
bot.launch();
