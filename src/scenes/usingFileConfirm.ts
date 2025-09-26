import fs from "fs";

import path from "path";
import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
import { inlineKeyboardNumbers } from "../lib/helper";
import {
  generateFormattedStringFromData,
  handlePythonScriptDocx,
} from "../services/createDocTemplatesWithPython";
import {
  createPresentation,
  createSlideEducationTemplate,
  createSlideWithAnimationDarkMode,
} from "../services/createSlide.service";
import {
  generateSlides,
  handlePythonScript,
} from "../services/createSlideTemplatesWithPython";
import {
  createPlansDescriptionLanguageFile,
  createPlansFile,
} from "../services/pdfToPpptx.service";
import { contentToString } from "../utils/functions";
import { chunkArrayInline } from "../utils/keyboards";
const scene = new Scenes.BaseScene("usingFileConfirm");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action("file_confirm", async (ctx: any) => {
  try {
    console.log("FIle confirm");
    const user_id = ctx.from.id;
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
      include: {
        wallet: true,
      },
    });

    if (!user) {
      return await ctx.reply("Foydalanuvchi topilmadi");
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
      return await ctx.reply("Chat topilmadi");
    }

    const fileText = await prisma.fileText.findFirst({
      where: {
        user_id: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!fileText) {
      return await ctx.reply("Fayl topilmadi");
    }
    await ctx.editMessageText(ctx.callbackQuery.message.text, {
      parse_mode: "HTML",
    });

    await ctx.reply("Taqdimot tayyorlayapman iltimos shoshilmang ⏳");

    createFileToPresentationAsync(chat, user, ctx, fileText.content)
      .then((res) => {})
      .catch(async (err) => {
        console.log(err);
        return await ctx.reply(
          "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring. /start buyrug'ini  bosing"
        );
      });
  } catch (error) {
    console.log(error, "xatolik");
    return await ctx.reply(
      "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring. /start buyrug'ini  bosing"
    );
  }
});

scene.action("reject", async (ctx: any) => {
  try {
    await ctx.reply("Taqdimot bekor qilindi");
    return await ctx.scene.enter("start");
  } catch (error) {
    console.log(error);
    return await ctx.reply(
      "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring. /start buyrug'ini  bosing"
    );
  }
});

scene.action("changeSlides", async (ctx: any) => {
  try {
    const user_id = ctx.from.id;
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
    });

    if (!user) {
      return await ctx.reply("Foydalanuvchi topilmadi");
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
      return await ctx.reply("Chat topilmadi");
    }

    const text = `📊 Slayd(prezentatsiyaning)ning necha sahifadan iboratligini belgilang 📝`;

    const countArray = await inlineKeyboardNumbers(5, 10, user_id);

    const result = chunkArrayInline(countArray, 3);

    await ctx.editMessageText(text, {
      reply_markup: {
        inline_keyboard: result,
      },
    });
  } catch (error) {
    console.log(error);
    return await ctx.reply(
      "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring. /start buyrug'ini  bosing"
    );
  }
});

scene.action(/\d+$/, async (ctx: any) => {
  try {
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

    await ctx.editMessageText(txt, {
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
            [
              {
                text: "📊 Slaydlar sonini o'zgartirish",
                callback_data: "changeSlides",
              },
            ],

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
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

scene.action("changeAuthor", async (ctx: any) => {
  try {
    const user_id = ctx.from.id;
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
    });

    if (!user) {
      return await ctx.reply("Foydalanuvchi topilmadi");
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
      return await ctx.reply("Chat topilmadi");
    }

    const text = `Muallifni o'zgartirish uchun yangi ism yuboring`;

    await ctx.editMessageText(text);

    ctx.session.user = {
      action: "changeAuthor",
      chat_id: chat.id,
    };
  } catch (error) {
    console.log(error);
    return await ctx.reply(
      "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring. /start buyrug'ini  bosing"
    );
  }
});

scene.on("message", async (ctx: any) => {
  try {
    const user_id = ctx.from.id;
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
    });

    if (!user) {
      return await ctx.reply("Foydalanuvchi topilmadi");
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
      return await ctx.reply("Chat topilmadi");
    }

    const text = ctx.message.text;

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: text,
      },
    });

    let txt = `🏙 <b>Taqdimot haqida</b>:

    👤 <b>Muallif:</b> ${updatedUser.name}
    🌍 <b>Til:</b> 🇺🇿 (O'zbekcha)
    📑 <b>Slaydlar:</b> <i>${chat.pageCount}</i> ta
    
    📌 <b>Mavzu:</b> <b>${chat?.name}</b>
    
    ✅ <b>Fayl yuklandi!</b>
    
    ⚠️ <i>Eslatma:</i> Avval taqdimot matnini ketma-ket yuboraman, so'ng faylni tayyorlayman. Iltimos, shoshilmang. ⏳`;

    try {
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
    } catch (editError) {
      console.log("Edit message error:", editError);
      // If editing fails, send a new message
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
          ],
        },
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.log(error);
    return await ctx.reply(
      "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring. /start buyrug'ini bosing"
    );
  }
});

const createFileToPresentationAsync = async (
  chat: any,
  user: any,
  ctx: any,
  fileText: string
) => {
  try {
    const plans = await createPlansFile(
      chat.pageCount,
      chat.pageCount,
      fileText
    );

    console.log(plans);
    for (let plan of plans) {
      await prisma.plan.create({
        data: {
          chat_id: chat.id,
          name: plan,
        },
      });
    }

    let plan = await prisma.plan.findMany({
      where: {
        chat_id: chat.id,
      },
    });

    for (let [index, p] of plan.entries()) {
      let txt = `📌${index + 1}. ${p.name.split("&&")[0]}\n`;

      let description: any;
      try {
        await ctx.telegram.sendChatAction(user.telegram_id, "typing");
        description = await createPlansDescriptionLanguageFile(
          p.name,
          fileText
        );
      } catch (error) {
        console.log(error);
      }

      await prisma.description.create({
        data: {
          plan_id: p.id,
          name: p.name,
          content: description.content,
          chat_id: chat.id,
        },
      });

      console.log(description.content);
      await ctx.telegram.sendChatAction(user.telegram_id, "typing");
      txt += contentToString(description.content, chat.lang); // contentToString(description.content, chat.lang);
      // txt += `\n\n ${description.content}`;
      await ctx.telegram.sendMessage(user.telegram_id, txt, {});
      await ctx.telegram.sendChatAction(user.telegram_id, "typing");
    }

    await ctx.reply("Sizning taqdimotlaringiz tayyor. Endi faylni yuboraman");

    const description = await prisma.description.findMany({
      where: {
        chat_id: chat.id,
      },
      include: {
        plan: true,
      },
    });

    let body = description;

    const title = {
      name: chat.name,
      author: user?.name,
    };

    const filePath = path.join(
      __dirname,
      `../../${user?.telegram_id}output.pptx`
    );
    const data = {
      title,
      body,
      path: filePath,
      changeAuthor: chat?.checkUser,
    };

    console.log(data);

    const slide = await createPresentation(data, chat.lang);

    let newDate = new Date().getTime();
    const datas = fs.readFileSync(filePath);
    await ctx.telegram.sendDocument(
      user?.telegram_id,
      {
        source: datas,
        filename: `${newDate}.pptx`,
      },
      {
        caption: `📌 Birinchi dizayndagi taqdimot`,
        parse_mode: "HTML",
      }
    );

    await fs.unlinkSync(filePath);

    const slidePrice = await prisma.plansSlides.findFirst({
      orderBy: {
        created_at: "desc",
      },
    });
    await prisma.wallet.update({
      where: {
        id: user?.wallet?.id,
      },
      data: {
        balance: {
          decrement: Number(3000),
        },
      },
    });
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        working: false,
      },
    });

    const filePaths = path.join(
      __dirname,
      `../../${user?.telegram_id}output.pptx`
    );

    const darkModeData = {
      title,
      body,
      paths: filePaths,
      changeAuthor: chat?.checkUser,
    };

    const slideDark = await createSlideWithAnimationDarkMode(
      darkModeData,
      chat.lang
    );

    const dataDark = fs.readFileSync(filePaths);

    await ctx.telegram.sendDocument(
      user?.telegram_id,
      {
        source: dataDark,
        filename: `${newDate}-dark.pptx`,
      },
      {
        caption: `📌 Ikkinchi dizayndagi taqdimot`,
        parse_mode: "HTML",
      }
    );

    fs.unlinkSync(filePaths);
    const filePathNew = path.join(
      __dirname,
      `../../${user?.telegram_id}output-education.pptx`
    );
    const educationSlideData = {
      title,
      body,
      paths: filePathNew,
      changeAuthor: chat?.checkUser,
    };

    const slideEducation = await createSlideEducationTemplate(
      educationSlideData
    );
    await sleep(500);

    const dataDarkEducation = fs.readFileSync(filePathNew);

    await ctx.telegram.sendDocument(
      user?.telegram_id,
      {
        source: dataDarkEducation,
        filename: `${newDate}-education.pptx`,
      },
      {
        caption: `📌 3- dizayndagi taqdimot`,
        parse_mode: "HTML",
      }
    );

    await fs.unlinkSync(filePathNew);

    const chatData = await prisma.chat.findFirst({
      where: {
        id: chat.id,
      },
      include: {
        plans: {
          include: {
            description: true,
          },
        },
      },
    });

    let templates = [
      "Explore",
      "Academic",
      "Organic",
      "Luminous",
      "Floral",
      "3D Float",
      "East Asia",
      "Snowflake",
    ];

    await ctx.telegram.sendMessage(
      user?.telegram_id,
      `Yana bir nechta shablonlarimiz bor kutib turing iltimos 🥹`
    );

    // await ctx.telegram.sendMessage(
    //   user?.telegram_id,
    //   "Keyingi 5 ta taqdimot turlarini yaratishda xatolikka duch keldik.Yaqin kunlarda tuzatamiz.Bizni to'g'ri tushunganingiz uchun raxmat"
    // );

    let pyPath = path.join(__dirname, `../../output2${user.telegram_id}.pptx`);
    for (let template of templates) {
      const stringDatas = generateSlides(
        {
          ...chatData,
          author: user.name,
        },
        template,
        user.telegram_id
      );

      const handlePy = await handlePythonScript(stringDatas);

      // const pyPath = path.join(
      //   __dirname,
      //   `../../output2${user.telegram_id}.pptx`
      // );

      const dataExplore = fs.readFileSync(pyPath);
      await ctx.telegram.sendDocument(
        user?.telegram_id,
        {
          source: dataExplore,
          filename: `${newDate}-${template}.pptx`,
        },
        {
          caption: `📌 Taqdimotingiz tayyor`,
          parse_mode: "HTML",
        }
      );

      await sleep(1000);
    }

    await fs.unlinkSync(pyPath);
    await ctx.telegram.sendMessage(
      user.telegram_id,
      "Word fayl ham yuboraman 📄.\nOzgina kutib turasangiz word fayl tayyor"
    );

    const stringDocx = generateFormattedStringFromData(
      chatData,
      user.telegram_id
    );
    const wordPath = path.join(
      __dirname,
      `../../output2${user.telegram_id}.docx`
    );

    const handlePy = await handlePythonScriptDocx(stringDocx);

    const wordData = fs.readFileSync(wordPath);

    await ctx.telegram.sendDocument(
      user.telegram_id,
      {
        source: wordData,
        filename: `${newDate}.docx`,
      },
      {
        caption: `📌 Taqdimotingizning word shakli tayyor`,
        parse_mode: "HTML",
      }
    );

    await fs.unlinkSync(wordPath);

    await ctx.telegram.sendMessage(
      user?.telegram_id,
      "Bosh menyuga o'tish uchun pastdagi tugmani bosing",
      {
        reply_markup: {
          keyboards: [["Bosh menyu"]],
        },
        resize_keyboard: true,
      }
    );
    return await ctx.scene.enter("start");
  } catch (error) {
    console.log(error);
    const user_id = ctx.from?.id;
    ctx.telegram.sendMessage(
      user_id,
      "Xatolik yuz berdi.Iltimos 5 daqiqadan so'ng urunib ko'ring hozir juda ko'p so'rov bor bizda \n /start buyrug'ini bosing "
    );
  }
};

export default scene;
