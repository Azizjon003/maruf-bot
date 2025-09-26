import console from "console";
import path from "path";
import PptxGenJS from "pptxgenjs";
import prisma from "../../prisma/prisma";
import { generateFormattedStringFromData } from "./createDocTemplatesWithPython";
import { createSlideEducationTemplate } from "./createSlide.service";
import { handlePythonScript } from "./createSlideTemplatesWithPython";

function roundReact(): void {
  let pres = new PptxGenJS();
  let slide = pres.addSlide();

  // Doira yaratish
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.3,
    y: 1.5,
    w: 9.5,
    h: 3.5,
    fill: { color: "ffffff" },
    line: {
      color: "0EC765",
    },
    rectRadius: 0.2, // Doira shaklini belgilash
    // Doira shaklini belgilash
  });

  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 3.5,
      fontSize: 14,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

  // Prezentatsiyani saqlash
  pres.writeFile({ fileName: "DoiraShakliVaMatn.pptx" }).then(() => {
    console.log("Prezentatsiya yaratildi va saqlandi.");
  });
}

// Funksiyani chaqirish

// roundReact();

// Kichik doirachalardan tashkil topish

function roundReactSmall(): void {
  let pres = new PptxGenJS();
  let slide = pres.addSlide();

  // Doira yaratish
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.3,
    y: 1.2,
    w: 4,
    h: 1.8,
    fill: { color: "ffffff" },
    line: {
      color: "0EC765",
    },
    rectRadius: 0.2, // Doira shaklini belgilash
    // Doira shaklini belgilash
  });

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 0.3,
      y: 1.2,
      w: 4,
      h: 1.5,
      fontSize: 12,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.7,
    y: 1.2,
    w: 4,
    h: 1.8,
    fill: { color: "ffffff" },
    line: {
      color: "0EC765",
    },
    rectRadius: 0.2, // Doira shaklini belgilash
    // Doira shaklini belgilash
  });

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 5.7,
      y: 1.2,
      w: 4,
      h: 1.5,
      fontSize: 12,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.7,
    y: 3.2,
    w: 4,
    h: 1.8,
    fill: { color: "ffffff" },
    line: {
      color: "0EC765",
    },
    rectRadius: 0.2, // Doira shaklini belgilash
    // Doira shaklini belgilash
  });

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 5.7,
      y: 3.2,
      w: 4,
      h: 1.5,
      fontSize: 12,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.3,
    y: 3.2,
    w: 4,
    h: 1.8,
    fill: { color: "ffffff" },
    line: {
      color: "0EC765",
    },
    rectRadius: 0.2, // Doira shaklini belgilash
    // Doira shaklini belgilash
  });

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 0.3,
      y: 3.2,
      w: 4,
      h: 1.5,
      fontSize: 12,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(`dasjkdnsakjd dnjskadksandsa kjdnsajkdsad skjdnsakjdnsakj`, {
    x: 5.7,
    y: 4,
    w: 4,
    h: 1.5,
    fontSize: 10,

    color: "f0f0f0",
    align: "left",
    valign: "top",
  });

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(`Matnning joylashuvi va o'lchami doirani`, {
    x: 0.3,
    y: 3.5,
    w: 4,
    h: 1.5,
    fontSize: 10,
    bold: true,
    color: "f0f0f0",
    align: "left",
    valign: "top",
  });
  slide.addText(
    "// E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan ",
    {
      x: 0.3,
      y: 4,
      w: 4,
      h: 1.5,
      fontSize: 10,
      color: "f0f0f0",
      align: "left",
      valign: "top",
    }
  );

  let five = pres.addSlide();
  five.addImage({
    path: path.join(__dirname, "../../image.png"),
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });

  five.addText("Personal Relationships in Pedagogy", {
    x: "5%",
    y: "15%",
    w: "90%",
    h: "10%",
    fontSize: 16,
    fontFace: "Playfair Display",
    bold: true,
    color: "f0f0f0",
  });

  five.addText(`NImadirlar text `, {
    x: "5%",
    y: "40%",
    w: "25%",
    h: "10%",
    fontSize: 10,
    italic: true,
    color: "f0f0f0",
    align: "center",
  });
  five.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "5%",
      y: "50%",
      w: "25%",
      h: "10%",
      fontSize: 10,
      italic: true,
      color: "f0f0f0",
      align: "center",
    }
  );

  five.addText(`NImadirlar text `, {
    x: "35%",
    y: "40%",
    w: "25%",
    h: "10%",
    fontSize: 10,
    italic: true,
    color: "f0f0f0",
    align: "center",
  });
  five.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "35%",
      y: "50%",
      w: "25%",
      h: "10%",
      fontSize: 10,
      italic: true,
      color: "f0f0f0",
      align: "center",
    }
  );

  five.addText(`NImadirlar text `, {
    x: "65%",
    y: "40%",
    w: "25%",
    h: "10%",
    fontSize: 10,
    italic: true,
    color: "f0f0f0",
    align: "center",
  });
  five.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "65%",
      y: "50%",
      w: "25%",
      h: "10%",
      fontSize: 10,
      italic: true,
      color: "f0f0f0",
      align: "center",
    }
  );
  const six = pres.addSlide();
  six.addImage({
    path: path.join(__dirname, "../../image.png"),
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });
  const textColor = "FFFFFF";
  const primaryColor = "6A0DAD"; // Dark purple
  const secondaryColor = "D3BFFF"; // Light purple

  // Add Title to the Slide
  six.addText("Timeline", {
    x: 1.5,
    y: 0.5,
    fontFace: "Arial",
    fontSize: 36,
    color: textColor,
  });

  // Add the timeline itself
  const timelineOpts = {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 3,
    lineSize: 3,
    lineColor: primaryColor,
    arrowHeadLength: 0,
    arrowTailLength: 0,
  };

  six.addShape(pres.ShapeType.line, timelineOpts);

  // Add the dates and descriptions
  const months = ["January", "February", "March", "April"];
  const descriptions = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque",
    "Foste natus error sit volupta tem accusa ntiu",
  ];

  months.forEach((month, i) => {
    // Add the month name
    six.addText(month, {
      x: 1.0,
      y: 1.5 * (i + 1),
      fontFace: "Arial",
      fontSize: 18,
      color: secondaryColor,
      align: "right",
    });

    // Add the description text
    six.addText(descriptions[i], {
      x: 2.0,
      y: 1.5 * (i + 1),
      w: 5.5,
      fontFace: "Arial",
      fontSize: 12,
      color: textColor,
    });

    // Add dots on the timeline
    six.addShape(pres.ShapeType.roundRect, {
      x: 1.8,
      y: 1.5 * (i + 1) - 0.1,
      w: 0.2,
      h: 0.2,
      fill: { color: primaryColor },
      line: { color: primaryColor },
    });
  });
  pres
    .writeFile({ fileName: "Animated_Presentation.pptx" })
    .then((fileName) => {
      console.log(`Created: ${fileName}`);
    });
}

// createAnimationSlide();
const test = async () => {
  const chatData = await prisma.chat.findFirst({
    where: {
      id: "236f7e6c-80fc-45bc-be5c-d2a0cce5969e",
      // id: "00385b3f-2a38-475b-956f-678ca74a8c6c",
    },
    include: {
      plans: {
        include: {
          description: true,
        },
      },
    },
  });
  console.log(chatData);
  // fs.writeFileSync("chatData.json", JSON.stringify(chatData));
  // generateSlides(chatData, "Explore");
  const stringDatas = generateFormattedStringFromData(chatData, "uz");

  // console.log(stringDatas);

  // const handlePy = await handlePythonScriptDocx(stringDatas);
  // const stringDatas = generateSlides(chatData, "Organic", "161651651");

  const handlePy = await handlePythonScript(stringDatas);

  // const handlePy = await handlePythonScript(stringDatas);
};

test();

const createModernTemplate = async () => {
  // Yangi PptxGenJS obyekti yaratish
  const pptx = new PptxGenJS();
  pptx.theme = { bodyFontFace: "Arial" };

  // 1-slide: Titul sahifasi
  const titleSlide = pptx.addSlide();

  // Orqa fon
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "1a237e" }, // To'q ko'k fon
    line: { color: "1a237e" },
  });

  // Gradient qismi
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: "60%",
    y: 0,
    w: "40%",
    h: "100%",
    fill: {
      color: "3949ab",
      transparency: 20,
    },
    line: { color: "1a237e" },
  });

  // Sarlavha
  titleSlide.addText("Zamonaviy Prezentatsiya", {
    x: "5%",
    y: "30%",
    w: "50%",
    h: "15%",
    fontSize: 36,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
  });

  // Muallif
  titleSlide.addText("Tayyorladi: User", {
    x: "5%",
    y: "50%",
    w: "50%",
    h: "10%",
    fontSize: 16,
    fontFace: "Arial",
    color: "FFFFFF",
    italic: true,
  });

  // 2-slide: Mundarija sahifasi
  const contentsSlide = pptx.addSlide();

  // Orqa fon
  contentsSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "1a237e" },
    line: { color: "1a237e" },
  });

  // Sarlavha
  contentsSlide.addText("Mundarija", {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 24,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
  });

  // Mundarija elementlari
  const contentItems = [
    "1. Kirish",
    "2. Asosiy qism",
    "3. Tahlil",
    "4. Natijalar",
    "5. Xulosa",
  ];

  const contentString = contentItems.join("\n\n");
  contentsSlide.addText(contentString, {
    x: "5%",
    y: "20%",
    w: "90%",
    h: "70%",
    fontSize: 16,
    color: "FFFFFF",
    bullet: { type: "number" },
  });

  // 3-slide: Ma'lumotlar sahifasi
  const infoSlide = pptx.addSlide();

  // Orqa fon
  infoSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "1a237e" },
    line: { color: "1a237e" },
  });

  // Sarlavha
  infoSlide.addText("Asosiy Ma'lumotlar", {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 24,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
  });

  // Tavsif
  infoSlide.addText(
    "Ushbu sahifada asosiy ma'lumotlar ko'rsatilgan. Siz o'z kontentingizni ushbu joyga kiritishingiz mumkin.",
    {
      x: "5%",
      y: "15%",
      w: "90%",
      h: "10%",
      fontSize: 14,
      color: "FFFFFF",
    }
  );

  // Ma'lumot bloklar
  for (let i = 0; i < 3; i++) {
    infoSlide.addShape(pptx.ShapeType.roundRect, {
      x: "5%",
      y: `${30 + i * 20}%`,
      w: "90%",
      h: "15%",
      fill: {
        color: "303f9f",
        transparency: 30,
      },
      line: {
        color: "5c6bc0",
        transparency: 0,
      },
      rectRadius: 0.2,
    });

    infoSlide.addText(`Ma'lumot bloki ${i + 1}`, {
      x: "7%",
      y: `${30 + i * 20}%`,
      w: "86%",
      h: "5%",
      fontSize: 16,
      bold: true,
      color: "FFFFFF",
      align: "left",
    });

    infoSlide.addText(
      "Bu yerda batafsil ma'lumotlar yozilishi mumkin. O'z ma'lumotlaringizni kiritib, prezentatsiyani boyiting.",
      {
        x: "7%",
        y: `${35 + i * 20}%`,
        w: "86%",
        h: "10%",
        fontSize: 12,
        color: "FFFFFF",
        align: "left",
      }
    );
  }

  // 4-slide: Kvadratlar sahifasi
  const gridSlide = pptx.addSlide();

  // Orqa fon
  gridSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "1a237e" },
    line: { color: "1a237e" },
  });

  // Sarlavha
  gridSlide.addText("Kvadratlar", {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 24,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
  });

  // 2x2 kvadratlar
  const positions = [
    { x: 0.5, y: 2.0 },
    { x: 5.5, y: 2.0 },
    { x: 0.5, y: 6.0 },
    { x: 5.5, y: 6.0 },
  ];

  positions.forEach((pos, index) => {
    gridSlide.addText(`Element ${index + 1}`, {
      x: pos.x,
      y: pos.y,
      w: 4.0,
      h: 0.8,
      fontSize: 16,
      bold: true,
      color: "FFFFFF",
    });

    gridSlide.addText(
      "Har bir kvadrat o'z ichiga ma'lumotlarni olishi mumkin. Bu yerda asosiy faktlar, dalillar yoki statistikani ko'rsating.",
      {
        x: pos.x,
        y: pos.y + 0.8,
        w: 4.0,
        h: 1.2,
        fontSize: 12,
        color: "FFFFFF",
      }
    );
  });

  // 5-slide: Jadval sahifasi
  const timelineSlide = pptx.addSlide();

  // Orqa fon
  timelineSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "1a237e" },
    line: { color: "1a237e" },
  });

  // Sarlavha
  timelineSlide.addText("Vaqt Chizig'i", {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 24,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
  });

  // Jadval chizig'i
  timelineSlide.addShape(pptx.ShapeType.line, {
    x: 1,
    y: 2.5,
    w: 8,
    h: 0,
    line: { color: "7986cb", width: 3 },
  });

  // Vaqt nuqtalari
  const timePoints = ["Yanvar", "Mart", "May", "Iyul"];
  const descriptions = [
    "Loyiha boshlandi",
    "Birinchi bosqich tugallandi",
    "Ikkinchi bosqich boshlandi",
    "Loyiha yakunlandi",
  ];

  timePoints.forEach((point, i) => {
    // Vaqt nuqtasi
    timelineSlide.addShape(pptx.ShapeType.ellipse, {
      x: 1 + i * 2.5,
      y: 2.4,
      w: 0.2,
      h: 0.2,
      fill: { color: "c5cae9" },
    });

    // Sana
    timelineSlide.addText(point, {
      x: 0.5 + i * 2.5,
      y: 2.8,
      w: 1.2,
      h: 0.3,
      fontSize: 14,
      color: "FFFFFF",
      bold: true,
      align: "center",
    });

    // Tavsif
    timelineSlide.addText(descriptions[i], {
      x: 0.2 + i * 2.5,
      y: 3.2,
      w: 1.8,
      h: 0.5,
      fontSize: 12,
      color: "FFFFFF",
      align: "center",
    });
  });

  // Fayl yaratish
  pptx.writeFile({ fileName: "Zamonaviy_Prezentatsiya.pptx" }).then(() => {
    console.log("Zamonaviy prezentatsiya yaratildi va saqlandi.");
  });
};

// createModernTemplate();

const createProfessionalTemplate = async () => {
  // Yangi PptxGenJS obyekti yaratish
  const pptx = new PptxGenJS();
  pptx.theme = { bodyFontFace: "Calibri" };

  // 1-slide: Titul sahifasi
  const titleSlide = pptx.addSlide();

  // Gradient orqa fon - fixed by using solid color
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "2c3e50" },
    line: { color: "2c3e50" },
  });

  // Add a gradient effect with two rectangles
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: "50%",
    y: 0,
    w: "50%",
    h: "100%",
    fill: { color: "3498db", transparency: 50 },
    line: { color: "2c3e50" },
  });

  // Header element
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "15%",
    fill: {
      color: "000000",
      transparency: 25,
    },
    line: { color: "2c3e50" },
  });

  // Sarlavha
  titleSlide.addText("Professional Prezentatsiya", {
    x: "10%",
    y: "35%",
    w: "80%",
    h: "15%",
    fontSize: 44,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // Taglavha
  titleSlide.addText("Biznes va Ta'lim Uchun", {
    x: "10%",
    y: "50%",
    w: "80%",
    h: "10%",
    fontSize: 24,
    fontFace: "Calibri",
    color: "FFFFFF",
    align: "center",
  });

  // Muallif
  titleSlide.addText("Tayyorladi: User", {
    x: "10%",
    y: "75%",
    w: "80%",
    h: "5%",
    fontSize: 16,
    fontFace: "Calibri",
    color: "FFFFFF",
    italic: true,
    align: "center",
  });

  // Sana
  const today = new Date();
  const dateStr = today.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  titleSlide.addText(dateStr, {
    x: "10%",
    y: "80%",
    w: "80%",
    h: "5%",
    fontSize: 14,
    fontFace: "Calibri",
    color: "FFFFFF",
    align: "center",
  });

  // 2-slide: Mundarija sahifasi
  const contentsSlide = pptx.addSlide();

  // Orqa fon - fixed by using solid color
  contentsSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "2c3e50" },
    line: { color: "2c3e50" },
  });

  // Add a gradient effect with two rectangles
  contentsSlide.addShape(pptx.ShapeType.rect, {
    x: "50%",
    y: 0,
    w: "50%",
    h: "100%",
    fill: { color: "3498db", transparency: 50 },
    line: { color: "2c3e50" },
  });

  // Header
  contentsSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "15%",
    fill: {
      color: "000000",
      transparency: 25,
    },
    line: { color: "2c3e50" },
  });

  // Sarlavha
  contentsSlide.addText("Mundarija", {
    x: "5%",
    y: "3%",
    w: "80%",
    h: "10%",
    fontSize: 32,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // Yon panel
  contentsSlide.addShape(pptx.ShapeType.rect, {
    x: "5%",
    y: "20%",
    w: "25%",
    h: "70%",
    fill: {
      color: "000000",
      transparency: 80,
    },
    line: { color: "FFFFFF" },
  });

  // Icon for contents
  contentsSlide.addText("📑", {
    x: "10%",
    y: "25%",
    w: "15%",
    h: "15%",
    fontSize: 48,
    align: "center",
  });

  // Mundarija elementlari
  const contentItems = [
    "1. Kirish",
    "2. Loyiha maqsadi",
    "3. Tahlil va metodologiya",
    "4. Natijalar va muhokama",
    "5. Xulosa va tavsiyalar",
    "6. Keyingi qadamlar",
  ];

  const contentString = contentItems.join("\n\n");
  contentsSlide.addText(contentString, {
    x: "35%",
    y: "20%",
    w: "60%",
    h: "70%",
    fontSize: 18,
    color: "FFFFFF",
    bullet: { type: "number" },
    fontFace: "Calibri",
    lineSpacing: 50,
  });

  // 3-slide: Ikki ustunli ma'lumotlar
  const twoColumnSlide = pptx.addSlide();

  // Orqa fon - fixed by using solid color
  twoColumnSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "2c3e50" },
    line: { color: "2c3e50" },
  });

  // Add a gradient effect with two rectangles
  twoColumnSlide.addShape(pptx.ShapeType.rect, {
    x: "50%",
    y: 0,
    w: "50%",
    h: "100%",
    fill: { color: "3498db", transparency: 50 },
    line: { color: "2c3e50" },
  });

  // Sarlavha
  twoColumnSlide.addText("Ikki ustunli ma'lumotlar", {
    x: "10%",
    y: "3%",
    w: "80%",
    h: "10%",
    fontSize: 28,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // Chap ustun
  twoColumnSlide.addShape(pptx.ShapeType.rect, {
    x: "5%",
    y: "20%",
    w: "42%",
    h: "70%",
    fill: {
      color: "FFFFFF",
      transparency: 85,
    },
    line: { color: "FFFFFF" },
  });

  // O'ng ustun
  twoColumnSlide.addShape(pptx.ShapeType.rect, {
    x: "53%",
    y: "20%",
    w: "42%",
    h: "70%",
    fill: {
      color: "FFFFFF",
      transparency: 85,
    },
    line: { color: "FFFFFF" },
  });

  // Chap ustun sarlavhasi
  twoColumnSlide.addText("Ma'lumot 1", {
    x: "5%",
    y: "20%",
    w: "42%",
    h: "10%",
    fontSize: 22,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // Chap ustun matni
  twoColumnSlide.addText(
    "• Ushbu qismda birinchi ma'lumotni taqdim eting\n• Muhim nuqtalarni ajratib ko'rsating\n• Aniq va qisqa jumlalar qo'llang\n• Grafiklar va rasmlar bilan boyiting",
    {
      x: "7%",
      y: "30%",
      w: "38%",
      h: "50%",
      fontSize: 16,
      fontFace: "Calibri",
      color: "FFFFFF",
      bullet: { type: "bullet" },
      lineSpacing: 40,
    }
  );

  // O'ng ustun sarlavhasi
  twoColumnSlide.addText("Ma'lumot 2", {
    x: "53%",
    y: "20%",
    w: "42%",
    h: "10%",
    fontSize: 22,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // O'ng ustun matni
  twoColumnSlide.addText(
    "• Ikkinchi ma'lumot bo'limini shu yerda bering\n• Muhim faktlarni ajratib ko'rsating\n• Taqqoslash uchun imkoniyat yarating\n• Natijalarni aniq ifodalang",
    {
      x: "55%",
      y: "30%",
      w: "38%",
      h: "50%",
      fontSize: 16,
      fontFace: "Calibri",
      color: "FFFFFF",
      bullet: { type: "bullet" },
      lineSpacing: 40,
    }
  );

  // 4-slide: Diagramma va infografika
  const diagramSlide = pptx.addSlide();

  // Orqa fon - fixed by using solid color
  diagramSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "2c3e50" },
    line: { color: "2c3e50" },
  });

  // Add a gradient effect with two rectangles
  diagramSlide.addShape(pptx.ShapeType.rect, {
    x: "50%",
    y: 0,
    w: "50%",
    h: "100%",
    fill: { color: "3498db", transparency: 50 },
    line: { color: "2c3e50" },
  });

  // Sarlavha
  diagramSlide.addText("Raqamli natijalar", {
    x: "10%",
    y: "3%",
    w: "80%",
    h: "10%",
    fontSize: 28,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // 4 ta doiraviy soha
  const chartPositions = [
    { x: 0.5, y: 2.0 },
    { x: 5.5, y: 2.0 },
    { x: 0.5, y: 5.5 },
    { x: 5.5, y: 5.5 },
  ];

  const chartTitles = ["Sotuv", "Marketing", "Ishlab chiqarish", "Moliya"];
  const percentages = [75, 60, 85, 45];
  const chartColors = ["3498db", "27ae60", "f1c40f", "e74c3c"];

  chartPositions.forEach((pos, index) => {
    // Doira asosi (100%)
    diagramSlide.addShape(pptx.ShapeType.ellipse, {
      x: pos.x + 1.5,
      y: pos.y + 0.5,
      w: 2,
      h: 2,
      fill: {
        color: "FFFFFF",
        transparency: 80,
      },
      line: { color: "FFFFFF" },
    });

    // Foiz doirasi - fixed by using circle segments instead of arc with angleStart/angleEnd
    // Using partial circles to simulate pie charts
    const angle = (percentages[index] / 100) * 360;
    if (angle <= 90) {
      // First quadrant only
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 2.5,
        y: pos.y + 0.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
        rotate: 90 - angle,
      });
    } else if (angle <= 180) {
      // First and second quadrant
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 2.5,
        y: pos.y + 0.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
      });
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 1.5,
        y: pos.y + 0.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
        rotate: 180 - angle,
      });
    } else if (angle <= 270) {
      // Three quadrants
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 2.5,
        y: pos.y + 0.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
      });
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 1.5,
        y: pos.y + 0.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
      });
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 1.5,
        y: pos.y + 1.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
        rotate: 270 - angle,
      });
    } else {
      // Almost full circle
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 2.5,
        y: pos.y + 0.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
      });
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 1.5,
        y: pos.y + 0.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
      });
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 1.5,
        y: pos.y + 1.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
      });
      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: pos.x + 2.5,
        y: pos.y + 1.5,
        w: 1,
        h: 1,
        fill: { color: chartColors[index] },
        rotate: 360 - angle,
      });
    }

    // Central percentage text
    diagramSlide.addText(`${percentages[index]}%`, {
      x: pos.x + 1.85,
      y: pos.y + 1.15,
      w: 1.3,
      h: 0.7,
      fontSize: 24,
      fontFace: "Calibri",
      color: "FFFFFF",
      bold: true,
      align: "center",
    });

    // Title text
    diagramSlide.addText(chartTitles[index], {
      x: pos.x + 0.5,
      y: pos.y + 2.6,
      w: 4,
      h: 0.5,
      fontSize: 18,
      fontFace: "Calibri",
      color: "FFFFFF",
      bold: true,
      align: "center",
    });
  });

  // 5-slide: Jadval va vaqt chizig'i
  const timelineSlide = pptx.addSlide();

  // Orqa fon - fixed by using solid color
  timelineSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "2c3e50" },
    line: { color: "2c3e50" },
  });

  // Add a gradient effect with two rectangles
  timelineSlide.addShape(pptx.ShapeType.rect, {
    x: "50%",
    y: 0,
    w: "50%",
    h: "100%",
    fill: { color: "3498db", transparency: 50 },
    line: { color: "2c3e50" },
  });

  // Sarlavha
  timelineSlide.addText("Loyiha vaqt chizig'i", {
    x: "10%",
    y: "3%",
    w: "80%",
    h: "10%",
    fontSize: 28,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // Jadval chizig'i
  timelineSlide.addShape(pptx.ShapeType.line, {
    x: 0.5,
    y: 3.0,
    w: 9.0,
    h: 0,
    line: { color: "FFFFFF", width: 3 },
  });

  // Vaqt nuqtalari
  const timePoints = ["1-chorak", "2-chorak", "3-chorak", "4-chorak"];
  const descriptions = [
    "Loyiha rejalashtirish va talablarni belgilash",
    "Dizayn va prototiplarni yaratish",
    "Ishlab chiqarish va testlash",
    "Yakuniy mahsulot va taqdimot",
  ];

  timePoints.forEach((point, i) => {
    // Vaqt nuqtasi
    timelineSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.3 + i * 2.3,
      y: 2.8,
      w: 2,
      h: 0.4,
      fill: { color: chartColors[i] },
      line: { color: "FFFFFF" },
      rectRadius: 0.2,
    });

    // Sana
    timelineSlide.addText(point, {
      x: 0.3 + i * 2.3,
      y: 2.8,
      w: 2,
      h: 0.4,
      fontSize: 14,
      color: "FFFFFF",
      bold: true,
      align: "center",
    });

    // Tavsif blok
    timelineSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.3 + i * 2.3,
      y: i % 2 === 0 ? 3.4 : 2.0,
      w: 2,
      h: 1.2,
      fill: {
        color: "FFFFFF",
        transparency: 80,
      },
      line: { color: chartColors[i] },
      rectRadius: 0.1,
    });

    // Connecting line
    timelineSlide.addShape(pptx.ShapeType.line, {
      x: 1.3 + i * 2.3,
      y: i % 2 === 0 ? 3.2 : 2.4,
      w: 0,
      h: i % 2 === 0 ? 0.2 : -0.2,
      line: { color: chartColors[i], width: 2 },
    });

    // Tavsif
    timelineSlide.addText(descriptions[i], {
      x: 0.4 + i * 2.3,
      y: i % 2 === 0 ? 3.5 : 2.1,
      w: 1.8,
      h: 1.0,
      fontSize: 12,
      color: "FFFFFF",
      align: "center",
    });
  });

  // 6-slide: Xulosa sahifasi
  const conclusionSlide = pptx.addSlide();

  // Orqa fon - fixed by using solid color
  conclusionSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: "2c3e50" },
    line: { color: "2c3e50" },
  });

  // Add a gradient effect with two rectangles
  conclusionSlide.addShape(pptx.ShapeType.rect, {
    x: "50%",
    y: 0,
    w: "50%",
    h: "100%",
    fill: { color: "3498db", transparency: 50 },
    line: { color: "2c3e50" },
  });

  // Sarlavha
  conclusionSlide.addText("Xulosa va Tavsiyalar", {
    x: "10%",
    y: "3%",
    w: "80%",
    h: "10%",
    fontSize: 28,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // Xulosa bloki
  conclusionSlide.addShape(pptx.ShapeType.roundRect, {
    x: "10%",
    y: "20%",
    w: "80%",
    h: "30%",
    fill: {
      color: "FFFFFF",
      transparency: 85,
    },
    line: { color: "FFFFFF" },
    rectRadius: 0.1,
  });

  // Xulosa matni
  conclusionSlide.addText("Loyiha xulosasi", {
    x: "12%",
    y: "22%",
    w: "76%",
    h: "5%",
    fontSize: 18,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
  });

  conclusionSlide.addText(
    "• Erishilgan natijalar va ko'rsatkichlar\n• Muvaffaqiyatli jihatlar va yutuqlar\n• O'zlashtirgan bilim va tajribalar",
    {
      x: "12%",
      y: "28%",
      w: "76%",
      h: "20%",
      fontSize: 16,
      fontFace: "Calibri",
      color: "FFFFFF",
      bullet: { type: "bullet" },
      lineSpacing: 40,
    }
  );

  // Tavsiyalar bloki
  conclusionSlide.addShape(pptx.ShapeType.roundRect, {
    x: "10%",
    y: "55%",
    w: "80%",
    h: "30%",
    fill: {
      color: "FFFFFF",
      transparency: 85,
    },
    line: { color: "FFFFFF" },
    rectRadius: 0.1,
  });

  // Tavsiyalar matni
  conclusionSlide.addText("Tavsiyalar", {
    x: "12%",
    y: "57%",
    w: "76%",
    h: "5%",
    fontSize: 18,
    fontFace: "Calibri",
    color: "FFFFFF",
    bold: true,
  });

  conclusionSlide.addText(
    "• Keyingi qadamlar uchun tavsiyalar\n• Rivojlantirishga oid takliflar\n• Yangi imkoniyatlar va istiqbollar",
    {
      x: "12%",
      y: "63%",
      w: "76%",
      h: "20%",
      fontSize: 16,
      fontFace: "Calibri",
      color: "FFFFFF",
      bullet: { type: "bullet" },
      lineSpacing: 40,
    }
  );

  // Fayl yaratish
  pptx.writeFile({ fileName: "Professional_Prezentatsiya.pptx" }).then(() => {
    console.log("Professional prezentatsiya yaratildi va saqlandi.");
  });
};

// createModernTemplate();
// createProfessionalTemplate();

async function createNavoiyPresentation(
  chatData: any,
  templateStyle:
    | "Modern"
    | "Professional"
    | "Minimal"
    | "Academic"
    | "Elegant" = "Modern"
) {
  // Create new presentation instance
  const pptx = new PptxGenJS();

  // Get chat data
  const title = chatData.name;
  const plans = chatData.plans;

  // Theme settings based on template style
  interface ThemeColors {
    background: string;
    accent: string;
    text: string;
    highlight: string;
  }

  let themeColors: ThemeColors;
  let fontFace: string;

  switch (templateStyle) {
    case "Modern":
      themeColors = {
        background: "1a237e",
        accent: "3949ab",
        text: "FFFFFF",
        highlight: "c5cae9",
      };
      fontFace = "Arial";
      break;
    case "Professional":
      themeColors = {
        background: "2c3e50",
        accent: "3498db",
        text: "FFFFFF",
        highlight: "f1c40f",
      };
      fontFace = "Calibri";
      break;
    case "Minimal":
      themeColors = {
        background: "ffffff",
        accent: "333333",
        text: "333333",
        highlight: "cccccc",
      };
      fontFace = "Helvetica";
      break;
    case "Academic":
      themeColors = {
        background: "f5f5f5",
        accent: "8b0000",
        text: "333333",
        highlight: "d3d3d3",
      };
      fontFace = "Georgia";
      break;
    case "Elegant":
      themeColors = {
        background: "000000",
        accent: "d4af37",
        text: "ffffff",
        highlight: "555555",
      };
      fontFace = "Cambria";
      break;
    default:
      themeColors = {
        background: "1a237e",
        accent: "3949ab",
        text: "FFFFFF",
        highlight: "c5cae9",
      };
      fontFace = "Arial";
  }

  pptx.theme = { bodyFontFace: fontFace };

  // Create title slide based on template style
  const titleSlide = pptx.addSlide();

  if (templateStyle === "Minimal") {
    // Minimal style - clean white with thin accent line
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fill: { color: themeColors.background },
      line: { color: themeColors.background },
    });

    // Thin accent line
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: "5%",
      y: "20%",
      w: "90%",
      h: 0.05,
      fill: { color: themeColors.accent },
    });

    titleSlide.addText(title, {
      x: "5%",
      y: "30%",
      w: "90%",
      h: "15%",
      fontSize: 36,
      fontFace: fontFace,
      color: themeColors.text,
      bold: true,
    });
  } else if (templateStyle === "Academic") {
    // Academic style with classic border
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fill: { color: themeColors.background },
      line: { color: themeColors.background },
    });

    // Decorative border
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: "5%",
      y: "5%",
      w: "90%",
      h: "90%",
      fill: { color: themeColors.background },
      line: { color: themeColors.accent, width: 3 },
    });

    // Title
    titleSlide.addText(title, {
      x: "10%",
      y: "40%",
      w: "80%",
      h: "15%",
      fontSize: 36,
      fontFace: fontFace,
      color: themeColors.accent,
      bold: true,
      align: "center",
    });
  } else if (templateStyle === "Elegant") {
    // Elegant dark theme with gold accents
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fill: { color: themeColors.background },
      line: { color: themeColors.background },
    });

    // Top and bottom accent lines
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: "10%",
      y: "25%",
      w: "80%",
      h: 0.1,
      fill: { color: themeColors.accent },
    });

    titleSlide.addShape(pptx.ShapeType.rect, {
      x: "10%",
      y: "65%",
      w: "80%",
      h: 0.1,
      fill: { color: themeColors.accent },
    });

    titleSlide.addText(title, {
      x: "10%",
      y: "35%",
      w: "80%",
      h: "20%",
      fontSize: 42,
      fontFace: fontFace,
      color: themeColors.accent,
      bold: true,
      align: "center",
    });
  } else {
    // Modern/Professional style with gradient
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fill: { color: themeColors.background },
      line: { color: themeColors.background },
    });

    // Gradient accent
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: "60%",
      y: 0,
      w: "40%",
      h: "100%",
      fill: {
        color: themeColors.accent,
        transparency: 30,
      },
      line: { color: themeColors.background },
    });

    // Title
    titleSlide.addText(title, {
      x: "5%",
      y: "30%",
      w: "50%",
      h: "15%",
      fontSize: 40,
      fontFace: fontFace,
      color: themeColors.text,
      bold: true,
    });
  }

  // Author and date for all styles
  const today = new Date();
  const dateStr = today.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use numeric values instead of percentage strings for positioning
  let authorY: number = 3.5; // ~50%
  let dateY: number = 4.2; // ~60%
  let authorAlign: "left" | "center" | "right" = "left";
  let dateAlign: "left" | "center" | "right" = "left";

  if (
    templateStyle === "Academic" ||
    templateStyle === "Elegant" ||
    templateStyle === "Minimal"
  ) {
    authorY = 4.5; // ~65%
    dateY = 5.2; // ~75%
    authorAlign = "center";
    dateAlign = "center";
  }

  // Use appropriate x position values
  const authorX =
    templateStyle === "Academic" ||
    templateStyle === "Elegant" ||
    templateStyle === "Minimal"
      ? 0.7
      : 0.35; // 10% vs 5%
  const authorWidth =
    templateStyle === "Academic" ||
    templateStyle === "Elegant" ||
    templateStyle === "Minimal"
      ? 8.0
      : 5.0; // 80% vs 50%

  titleSlide.addText(`Tayyorladi: ${chatData.author || "User"}`, {
    x: authorX,
    y: authorY,
    w: authorWidth,
    h: 0.7, // 10%
    fontSize: 16,
    fontFace: fontFace,
    color: themeColors.text,
    italic: true,
    align: authorAlign,
  });

  titleSlide.addText(dateStr, {
    x: authorX,
    y: dateY,
    w: authorWidth,
    h: 0.35, // 5%
    fontSize: 14,
    fontFace: fontFace,
    color: themeColors.text,
    align: dateAlign,
  });

  // 2. Contents slide
  const contentsSlide = pptx.addSlide();

  // Background for content slide
  contentsSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: themeColors.background },
    line: { color: themeColors.background },
  });

  // Style-specific content slide design
  if (templateStyle === "Minimal") {
    // Thin accent line
    contentsSlide.addShape(pptx.ShapeType.rect, {
      x: "5%",
      y: "15%",
      w: "90%",
      h: 0.05,
      fill: { color: themeColors.accent },
    });
  } else if (templateStyle === "Academic") {
    // Decorative border
    contentsSlide.addShape(pptx.ShapeType.rect, {
      x: "5%",
      y: "5%",
      w: "90%",
      h: "90%",
      fill: { color: themeColors.background },
      line: { color: themeColors.accent, width: 3 },
    });
  } else if (templateStyle === "Elegant") {
    // Top accent line
    contentsSlide.addShape(pptx.ShapeType.rect, {
      x: "10%",
      y: "20%",
      w: "80%",
      h: 0.1,
      fill: { color: themeColors.accent },
    });
  } else {
    // Modern/Professional style with gradient
    contentsSlide.addShape(pptx.ShapeType.rect, {
      x: "60%",
      y: 0,
      w: "40%",
      h: "100%",
      fill: {
        color: themeColors.accent,
        transparency: 30,
      },
      line: { color: themeColors.background },
    });
  }

  // Contents title
  contentsSlide.addText("Mundarija", {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 32,
    fontFace: fontFace,
    color: themeColors.text,
    bold: true,
    align:
      templateStyle === "Academic" ||
      templateStyle === "Elegant" ||
      templateStyle === "Minimal"
        ? "center"
        : "left",
  });

  // Create content items from plan names
  const contentItems = plans.map((plan: any, index: number) => {
    // Split the plan name on "&&" and take the Uzbek part (first part)
    const planName = plan.name.split("&&")[0].trim();
    return `${index + 1}. ${planName}`;
  });

  const contentString = contentItems.join("\n\n");
  contentsSlide.addText(contentString, {
    x:
      templateStyle === "Academic" || templateStyle === "Elegant"
        ? "10%"
        : "5%",
    y: templateStyle === "Minimal" ? "25%" : "20%",
    w:
      templateStyle === "Academic" || templateStyle === "Elegant"
        ? "80%"
        : "90%",
    h: "70%",
    fontSize: 18,
    fontFace: fontFace,
    color: themeColors.text,
    bullet: { type: "number" },
    lineSpacing: 40,
  });

  // 3. Content slides - one for each plan
  plans.forEach((plan: any, index: number) => {
    if (!plan.description || !plan.description[0]) return;

    const planData = plan.description[0];
    // Split the plan name on "&&" and take the Uzbek part (first part)
    const planTitle = plan.name.split("&&")[0].trim();
    const contentItems = planData.content;

    const slide = pptx.addSlide();

    // Background
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fill: { color: themeColors.background },
      line: { color: themeColors.background },
    });

    // Style-specific content slide design
    if (templateStyle === "Minimal") {
      // Thin accent line
      slide.addShape(pptx.ShapeType.rect, {
        x: "5%",
        y: "15%",
        w: "90%",
        h: 0.05,
        fill: { color: themeColors.accent },
      });
    } else if (templateStyle === "Academic") {
      // Decorative border
      slide.addShape(pptx.ShapeType.rect, {
        x: "5%",
        y: "5%",
        w: "90%",
        h: "90%",
        fill: { color: themeColors.background },
        line: { color: themeColors.accent, width: 3 },
      });
    } else if (templateStyle === "Elegant") {
      // Top accent line
      slide.addShape(pptx.ShapeType.rect, {
        x: "10%",
        y: "20%",
        w: "80%",
        h: 0.1,
        fill: { color: themeColors.accent },
      });
    } else {
      // Modern/Professional style with gradient
      slide.addShape(pptx.ShapeType.rect, {
        x: "60%",
        y: 0,
        w: "40%",
        h: "100%",
        fill: {
          color: themeColors.accent,
          transparency: 30,
        },
        line: { color: themeColors.background },
      });
    }

    // Plan title
    slide.addText(planTitle, {
      x: "5%",
      y: "5%",
      w: "90%",
      h: "10%",
      fontSize: 28,
      fontFace: fontFace,
      color: themeColors.text,
      bold: true,
      align:
        templateStyle === "Academic" ||
        templateStyle === "Elegant" ||
        templateStyle === "Minimal"
          ? "center"
          : "left",
    });

    // Layout styles for content items
    let layoutStyle;

    if (templateStyle === "Minimal") {
      layoutStyle = "grid"; // 2x2 grid layout
    } else if (templateStyle === "Academic") {
      layoutStyle = "vertical"; // Vertical list layout
    } else if (templateStyle === "Elegant") {
      layoutStyle = "centerFocus"; // Centered important items
    } else {
      layoutStyle = "grid"; // Default 2x2 grid
    }

    // Add content items based on layout style
    if (layoutStyle === "vertical") {
      // Vertical list layout - Academic style
      contentItems.forEach((item: any, itemIndex: number) => {
        const yPos = 2.5 + itemIndex * 1.5;

        // Add title
        slide.addText(item.title, {
          x: "10%",
          y: yPos,
          w: "80%",
          h: 0.6,
          fontSize: 18,
          fontFace: fontFace,
          color: themeColors.accent,
          bold: true,
          align: "left",
        });

        // Add content
        slide.addText(item.content, {
          x: "10%",
          y: yPos + 0.7,
          w: "80%",
          h: 0.8,
          fontSize: 16,
          fontFace: fontFace,
          color: themeColors.text,
          align: "left",
        });
      });
    } else if (layoutStyle === "centerFocus") {
      // Center focus layout - Elegant style
      contentItems.forEach((item: any, itemIndex: number) => {
        // Calculate spiral-like positioning around the center
        let xPos: number;
        let yPos: number;

        if (itemIndex === 0) {
          // Center position for the first item
          xPos = 2.5; // ~25%
          yPos = 2.5;

          // Add center highlight box
          slide.addShape(pptx.ShapeType.rect, {
            x: 2.0, // ~20%
            y: 2.3,
            w: 6.0, // ~60%
            h: 2.0,
            fill: { color: themeColors.highlight, transparency: 80 },
            line: { color: themeColors.accent, width: 1 },
          });
        } else if (itemIndex === 1) {
          xPos = 5.5; // ~55%
          yPos = 2.0;
        } else if (itemIndex === 2) {
          xPos = 1.5; // ~15%
          yPos = 4.5;
        } else {
          xPos = 5.5; // ~55%
          yPos = 4.5;
        }

        // Add title
        slide.addText(item.title, {
          x: xPos,
          y: yPos,
          w: 3.0, // ~30%
          h: 0.5,
          fontSize: itemIndex === 0 ? 20 : 16,
          fontFace: fontFace,
          color: itemIndex === 0 ? themeColors.accent : themeColors.text,
          bold: true,
          align: "center" as "center",
        });

        // Add content
        slide.addText(item.content, {
          x: xPos,
          y: yPos + 0.6,
          w: 3.0, // ~30%
          h: 0.8,
          fontSize: itemIndex === 0 ? 16 : 14,
          fontFace: fontFace,
          color: themeColors.text,
          align: "center" as "center",
        });
      });
    } else {
      // Grid layout - Modern, Professional, Minimal styles
      contentItems.forEach((item: any, itemIndex: number) => {
        // Calculate position based on index
        const xPos = itemIndex % 2 === 0 ? "5%" : "55%";
        const yPos = itemIndex < 2 ? 2.0 : 5.0;

        // Add shape for content box if not Minimal
        if (templateStyle !== ("Minimal" as any)) {
          slide.addShape(pptx.ShapeType.roundRect, {
            x: xPos,
            y: yPos,
            w: "40%",
            h: 2.5,
            fill: {
              color: themeColors.accent,
              transparency:
                templateStyle === "Modern" || templateStyle === "Professional"
                  ? 70
                  : 90,
            },
            line: {
              color:
                templateStyle === "Minimal"
                  ? themeColors.accent
                  : themeColors.text,
              transparency: 30,
            },
            rectRadius: 0.1,
          });
        } else {
          // For Minimal, just add a thin underline
          slide.addShape(pptx.ShapeType.rect, {
            x: xPos,
            y: yPos + 0.7,
            w: "40%",
            h: 0.03,
            fill: { color: themeColors.accent },
          });
        }

        // Add title
        slide.addText(item.title, {
          x: xPos,
          y: yPos,
          w: "40%",
          h: 0.7,
          fontSize: 16,
          fontFace: fontFace,
          color: themeColors.text,
          bold: true,
        });

        // Add content
        slide.addText(item.content, {
          x: xPos,
          y: yPos + 0.8,
          w: "40%",
          h: 1.5,
          fontSize: 14,
          fontFace: fontFace,
          color: themeColors.text,
        });
      });
    }
  });

  // Save file
  const fileName = `${title}_${templateStyle}.pptx`;
  return pptx.writeFile({ fileName }).then(() => {
    console.log(`Prezentatsiya yaratildi va saqlandi: ${fileName}`);
    return fileName;
  });
}

// Function to generate slides from chat data with different templates
async function generateNavoiySlides(chatData: any, templateStyle: string) {
  if (
    ["Modern", "Professional", "Minimal", "Academic", "Elegant"].includes(
      templateStyle
    )
  ) {
    return createNavoiyPresentation(chatData, templateStyle as any);
  } else {
    console.error("Unsupported template style");
    return null;
  }
}

// Test function to generate slides with all templates
const testAllTemplates = async () => {
  try {
    // const chatData = await prisma.chat.findFirst({
    //   where: {
    //     id: "236f7e6c-80fc-45bc-be5c-d2a0cce5969e",
    //   },
    //   include: {
    //     plans: {
    //       include: {
    //         description: true,
    //       },
    //     },
    //   },
    // });

    const chatData = await prisma.description.findMany({
      where: {
        chat_id: "236f7e6c-80fc-45bc-be5c-d2a0cce5969e",
      },
      include: {
        plan: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    if (!chatData) {
      console.error("Chat data not found");
      return;
    }

    const data = {
      title: "Navoiy",
      body: chatData,
      paths: `${__dirname}/../../output.pptx`,
      changeAuthor: "Aliqulov Azizjon",
    };

    await createSlideEducationTemplate(data);
    console.log("All presentations created successfully");
  } catch (error) {
    console.error("Error creating presentations:", error);
  }
};

// Un-comment to test the function
// testAllTemplates(); // Commenting out after testing
//
// testAllTemplates();
