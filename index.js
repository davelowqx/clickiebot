const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();

const MESSAGE =
  "Beep boop. Tag me @passitaroundbot directly in the chat where you wish to create a board.";

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(MESSAGE));
bot.help((ctx) => ctx.reply(MESSAGE));
bot.on("message", (ctx) => ctx.reply(MESSAGE));
bot.catch((err, ctx) => {
  console.error(err);
  ctx.reply(`Oops, encountered error for ${ctx.updateType}`, err);
});

bot.action("me", async (ctx) => {
  console.log(ctx.update);
  const { first_name } = ctx.from;
  const datetimeString = new Date().toLocaleString("default", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
  const title = "";
  //   ctx.callbackQuery..split("\n")[0];
  ctx.editMessageText(
    `${title}\n${datetimeString} ${first_name}`,
    Markup.inlineKeyboard([Markup.button.callback("me", "me")])
  );
});

bot.on("inline_query", (ctx) => {
  const title = ctx.update.inline_query.query;
  if (title && title.split("\n").length === 1) {
    ctx.answerInlineQuery([
      {
        type: "article",
        id: title,
        title,
        input_message_content: {
          message_text: `*${title}*`,
          parse_mode: "MarkdownV2",
        },
        reply_markup: Markup.inlineKeyboard([
          Markup.button.callback("me", "me"),
        ]).reply_markup,
      },
    ]);
  } else {
    ctx.answerInlineQuery([]);
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
