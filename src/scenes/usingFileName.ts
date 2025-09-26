import console from "console";
import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
import { chunkArrayInline } from "../utils/keyboards";
import { languages } from "./slidesCount";
const scene = new Scenes.BaseScene("addFileName");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  try {
    const text = ctx.update.message?.text;

    const user = ctx.from; // Foydalanuvchi ma'lumotlarini olish
    const users = await prisma.user.findUnique({
      where: { telegram_id: user.id.toString() },
    });

    if (!users) {
      return ctx.reply("Foydalanuvchi topilmadi");
    }

    const slideName = text;

    const chat = await prisma.chat.create({
      data: {
        name: slideName,
        user_id: users.id,
      },
    });
    const keyboard = chunkArrayInline(languages, 2);

    console.log(keyboard, "keyboard");
    ctx.reply("🌍 Slayd(Prezentatsiya) tilini tanlang 🔤", {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

    return ctx.scene.enter("addFileLanguage");
  } catch (error) {
    console.error("Error processing message:", error);
    await ctx.reply(
      "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring. /start buyrug'ini  bosing"
    );
  }
});
export default scene;
