import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
import { inlineKeyboardNumbers } from "../lib/helper";
import { chunkArrayInline } from "../utils/keyboards";
const scene = new Scenes.BaseScene("addFileLanguage");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action(["eng", "ru", "uz", "fr", "de"], async (ctx: any) => {
  try {
    // Update the type of ctx
    ctx.answerCbQuery();
    ctx.deleteMessage();
    const lang = ctx.callbackQuery?.data;
    const user_id = String(ctx.from.id);
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: user_id,
      },
    });

    if (!user) {
      ctx.reply("You are not registered. Please /start the bot first.");
      return;
    }

    const chat = await prisma.chat.findFirst({
      where: {
        user_id: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!chat) {
      ctx.reply("You have not started any chat. Please /start the bot first.");
      return;
    }

    if (lang === "eng") {
      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          language: "English",
          lang: "eng",
        },
      });
    } else if (lang === "ru") {
      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          language: "Russian",
          lang: "ru",
        },
      });
    } else if (lang === "uz") {
      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          language: "Uzbek",
          lang: "uz",
        },
      });
    } else if (lang === "fr") {
      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          language: "French",
          lang: "fr",
        },
      });
    } else if (lang === "de") {
      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          language: "German",
          lang: "de",
        },
      });
    }

    const text = `📊 Endi menga slayd(prezentatsiyaning)ning necha sahifadan iboratligini belgilang 📝`;

    const countArray = await inlineKeyboardNumbers(5, 10, user_id);

    const result = chunkArrayInline(countArray, 3);

    await ctx.reply(text, {
      reply_markup: {
        inline_keyboard: result,
      },
    });

    return await ctx.scene.enter("addFileCount");
  } catch (error) {
    console.log(error, "Xatolik");
  }
});
export default scene;
