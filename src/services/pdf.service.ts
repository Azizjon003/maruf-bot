import fs from "fs";
import pdf from "pdf-parse";
export async function readPdfText(filePath: string) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text.trim();
  } catch (error) {
    return null;
  }
}

// Slayd content validatsiyasi uchun regex
const slidePatternsV2 = {
  mainText: /^.{400,}$/, // Asosiy matn kamida 400 belgi
};

// Tekshirish funksiyasi
export function validateSlideContent(content: string) {
  if (!slidePatternsV2.mainText.test(content)) {
    return true;
  }

  return false;
}
