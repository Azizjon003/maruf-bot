import dotenv from "dotenv";
import { AzureOpenAI } from "openai";

dotenv.config();

async function main() {
  // You will need to set these environment variables or edit the following values
  const endpoint =
    process.env["AZURE_OPENAI_ENDPOINT"] ||
    "https://magicslide-api.openai.azure.com/";
  const apiKey =
    process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
  const apiVersion = "2024-05-01-preview";
  const deployment = "gpt-4o"; // This must match your deployment name

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

  const result = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that helps people find information.",
      },
      { role: "user", content: "Sallom qalesan" },
      {
        role: "assistant",
        content:
          "Va alaykum assalom! Yaxshi, rahmat, o'zingiz yaxshimisiz? Qanday yordam bera olaman? 😊",
      },
      { role: "user", content: "salom yaxshimisan" },
    ],
    max_tokens: 800,
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null,
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
