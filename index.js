const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const fetch = require("node-fetch").default;

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);
bot.start((ctx) =>
  ctx.reply(
    "This is an inline bot. Mention me in the group where you want to create a board."
  )
);

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

bot.on("chosen_inline_result", ({ chosenInlineResult }) => {
  console.log("chosen inline result", chosenInlineResult);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// bot.on("message", async (ctx) => {
//   if (ctx.message.text.split("\n").length > 1) {
//     ctx.reply("Oops! The title must be a single line.");
//   } else {
//     ctx.reply("Congratulations, you have created a new board!");
//     ctx.replyWithMarkdownV2(
//       `${ctx.message.text}`,
//       Markup.inlineKeyboard([
//         Markup.button.switchToChat("Publish", ctx.message.text),
//         Markup.button.callback("me", "me"),
//       ])
//     );
//   }
// });
