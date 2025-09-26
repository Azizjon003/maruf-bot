import axios from "axios";
import console from "console";
import fs from "fs";
import path from "path";
import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
import { readPdfText, validateSlideContent } from "../services/pdf.service";
const scene = new Scenes.BaseScene("usingFile");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("document", async (ctx: any) => {
  const document = ctx.message.document;
  const user = ctx.from; // Foydalanuvchi ma'lumotlarini olish
  const users = await prisma.user.findUnique({
    where: { telegram_id: user.id.toString() },
  });

  if (!users) {
    return ctx.reply("Foydalanuvchi topilmadi");
  }
  // Check if the file is PDF
  if (!document.mime_type || document.mime_type !== "application/pdf") {
    await ctx.reply(
      "Iltimos, faqat PDF formatdagi fayllarni yuborishingiz mumkin!"
    );
    return;
  }

  // Check file size (10MB = 10 * 1024 * 1024 bytes)
  if (document.file_size > 5 * 1024 * 1024) {
    await ctx.reply("Fayl hajmi 5MB dan oshmasligi kerak!");
    return;
  }

  try {
    // Get file link
    const file = await ctx.telegram.getFile(document.file_id);
    const fileLink = `https://api.telegram.org/file/bot${process.env.TOKEN}/${file.file_path}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${document.file_name}`;
    const filePath = path.join(uploadsDir, fileName);

    // Download file
    const response = await axios({
      method: "get",
      url: fileLink,
      responseType: "stream",
    });

    // Save file to uploads directory
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Save file path to session
    ctx.session.pdfFilePath = filePath;
    ctx.session.expectingPDF = false;
    const textFile = await readPdfText(filePath);

    if (!textFile) {
      await ctx.reply(
        "Faylni o'qishda xatolik yuz berdi. Boshqa fayl yuboring yoki matn yuboring "
      );
      return;
    }

    // Foydalanuvchini bazadan topish

    // Chat yaratish

    await prisma.fileText.create({
      data: {
        name: document.file_name,
        content: textFile,
        user_id: users.id,
      },
    });

    // Kanalga yuborish uchun xabar tayyorlash
    const channelMessage = `
📄 Yangi PDF fayl yuklandi!

👤 Yuboruvchi: ${user.first_name} ${user.last_name || ""}
🆔 ID: ${user.id}
📱 Username: @${user.username || "mavjud emas"}
⏰ Vaqt: ${new Date().toLocaleString()}
📎 Fayl nomi: ${document.file_name}
📦 Fayl hajmi: ${(document.file_size / 1024 / 1024).toFixed(2)}MB
    `;

    // Faylni kanalga yuborish
    try {
      await ctx.telegram.sendDocument(
        process.env.CHANNEL_ID,
        document.file_id,
        {
          caption: channelMessage,
        }
      );
    } catch (channelError) {
      console.error("Error sending to channel:", channelError);
      // Kanalga yuborishdagi xato botning ishlashiga ta'sir qilmasligi kerak
    }

    await ctx.reply(
      `Fayl muvaffaqiyatli yuklandi. Endi menga slayd(prezentatsiyaning) nomini yuboring`
    );

    return ctx.scene.enter("addFileName");
  } catch (error) {
    console.error("Error processing PDF file:", error);
    await ctx.reply(
      "Faylni qayta ishlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
    );
  }
});

scene.on("message", async (ctx: any) => {
  try {
    const text = ctx.update.message?.text;
    const isRule = validateSlideContent(text);

    if (!isRule) {
      await ctx.reply("Matn 400 belgidan kam bo'lishi kerak!");
      return;
    }

    const user = ctx.from; // Foydalanuvchi ma'lumotlarini olish
    const users = await prisma.user.findUnique({
      where: { telegram_id: user.id.toString() },
    });

    if (!users) {
      return ctx.reply("Foydalanuvchi topilmadi");
    }

    await prisma.fileText.create({
      data: {
        name: "Matn",
        content: text,
        user_id: users.id,
      },
    });

    ctx.reply(
      "✅ Matn qabul qilindi\n🎯 Endi menga slayd(prezentatsiyaning) nomini yuboring"
    );

    return ctx.scene.enter("addFileName");
  } catch (error) {
    console.error("Error processing message:", error);
    await ctx.reply(
      "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring. /start buyrug'ini  bosing"
    );
  }
});
export default scene;
