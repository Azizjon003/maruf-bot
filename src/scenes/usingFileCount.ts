import console from "console";
import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("addFileCount");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action(/\d+$/, async (ctx: any) => {
  try {
    await ctx.deleteMessage();
    const user_id = ctx.from?.id;
    let user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
      include: {
        model: true,
      },
    });

    if (!user) return ctx.reply("Foydalanuvchi mavjud emas");
    if (!user?.model_id) {
      const model = await prisma.gptModel.findFirst({
        where: {
          name: "gpt-3",
        },
      });
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          model_id: model?.id,
        },
        include: {
          model: true,
        },
      });
    }
    const count = ctx.callbackQuery.data;
    let chat = await prisma.chat.findFirst({
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

    await ctx.reply("Siz tanlagan taqdimotlar soni: " + count);

    chat = await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        pageCount: Number(count),
        model_id: user?.model_id,
      },
    });

    ctx.session.user = {
      action: "slidesName",
      chat_id: chat.id,
    };

    let txt = `🏙 <b>Taqdimot haqida</b>:

    👤 <b>Muallif:</b> ${user?.name}
    🌍 <b>Til:</b> 🇺🇿 (O'zbekcha)
    📑 <b>Slaydlar:</b> <i>${chat.pageCount}</i> ta
    
    📌 <b>Mavzu:</b> <b>${chat?.name}</b>
    
    ✅ <b>Fayl yuklandi!</b>
    
    ⚠️ <i>Eslatma:</i> Avval taqdimot matnini ketma-ket yuboraman, so'ng faylni tayyorlayman. Iltimos, shoshilmang. ⏳`;

    await ctx.reply(txt, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅ Tasdiqlash",
              callback_data: "file_confirm",
            },
          ],
          [
            {
              text: "✏️ Muallifni o'zgartirish",
              callback_data: "changeAuthor",
            },
          ],

          [
            {
              text: "📊 Slaydlar sonini o'zgartirish",
              callback_data: "changeSlides",
            },
          ],

          [
            {
              text: "❌ Bekor qilish",
              callback_data: "reject",
            },
          ],
          // [
          //   {
          //     text: "🧑‍🏫 Tekshirgan ustozni o'zgartirish",
          //     callback_data: "changeChecked",
          //   },
          // ],
        ],
      },
      parse_mode: "HTML",
    });

    return await ctx.scene.enter("usingFileConfirm");
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

export default scene;
