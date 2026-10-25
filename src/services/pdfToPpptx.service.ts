import xss from "xss";
import { modelLang } from "./createPlansUseOpenAi";
import { openai, AI_MODEL } from "../utils/ai";
const fs = require("fs");
const pdf = require("pdf-parse");

async function readPdfText(filePath: string) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text.trim();
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    throw error;
  }
}
export let createPlansFile = async (
  pages: number,
  pagesCount: number,
  contentFile: string,
  model: modelLang = modelLang.gpt3
) => {
  let models = {
    "gpt-3": AI_MODEL,
    "gpt-4": AI_MODEL,
    fallback: AI_MODEL, // Fallback model if preferred model fails
  };

  let selectedModel = models["gpt-3"]; // Default to gpt-3 if invalid model specified

  console.log(`Using model: ${selectedModel} for generating ${pages} slides`);

  // Trim content if it's too long (approximate token limit)
  // A rough estimate is 1 token = 4 characters for English text
  const MAX_CONTENT_SIZE = 15000; // characters, roughly 3750 tokens
  const trimmedContent =
    contentFile.length > MAX_CONTENT_SIZE
      ? contentFile.substring(0, MAX_CONTENT_SIZE) +
        "... (content truncated due to length)"
      : contentFile;

  let queryJson = {
    input_text: `Based on the text provided, create a precise and comprehensive structured outline with EXACTLY ${pagesCount} pages that captures all essential sections and sub-sections of the document. 

STRICT REQUIREMENTS:
1. Generate EXACTLY ${pages} slide plans with detailed content.
2. Ensure the outline reflects all key topics, main ideas, processes, and relevant models/frameworks from the text.
3. Structure each slide with:
   - Clear main heading (without any special characters ?, !, ., :, or punctuation)
   - Relevant subheadings and key points
   - Logical flow between slides

FORMAT REQUIREMENTS:
1. DO NOT use meta-commentary (like "Include pictures here about...")
2. DO NOT refer to the outline itself
3. Present content directly as if it were slide content
4. Maintain consistent formatting across all slides
5. Ensure complete coverage of all important topics from the source text
6. Keep descriptions concise yet comprehensive

IMPORTANT NOTES:
- Use only information from the provided text
- Do not mix or add unrelated topics
- Ensure the total number of slides exactly matches ${pages}
- Remove all numbers from slide titles
- Format all content precisely according to the required JSON structure
- Balance content distribution across all slides
`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          ...Array.from({ length: pages }, () => {
            return {
              lang: `{{content}}`,
              eng: "{{english_content}}",
            };
          }),
        ],
      },
    },
  };

  const maxRetries = 2;
  let retryCount = 0;
  let success = false;
  let chatCompletion;

  while (!success && retryCount <= maxRetries) {
    try {
      chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: "user", content: trimmedContent },
          {
            role: "system",
            content: JSON.stringify(queryJson),
          },
        ],
        model: selectedModel,
        max_tokens:
          pages <= 5 ? 1500 : pages <= 10 ? 2000 : pages <= 15 ? 2500 : 3000,
        response_format: {
          type: "json_object",
        },
      });
      success = true;
    } catch (error) {
      console.error(
        `API request failed (attempt ${retryCount + 1}/${maxRetries + 1}):`,
        error
      );
      retryCount++;

      // If we've tried the preferred model and failed, switch to fallback model
      if (retryCount === 1 && selectedModel !== models["fallback"]) {
        console.log(`Switching to fallback model: ${models["fallback"]}`);
        selectedModel = models["fallback"];
      }

      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (!chatCompletion) {
    console.error("All API requests failed after retries");
    return [];
  }

  const content = chatCompletion.choices[0].message.content || ""; // Handle null case

  let plans;

  try {
    plans = JSON.parse(content).slides.plans;
    if (!plans || !Array.isArray(plans) || plans.length !== pages) {
      console.error("Error: Invalid plans format or incorrect number of pages");
      console.log("Received content:", content);
      throw new Error(
        "Invalid response format - doesn't match expected structure"
      );
    }
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    // Fallback attempt with simplified structure
    try {
      const simplifiedContent = content.replace(/[\r\n\t]/g, "").trim();
      const parsedContent = JSON.parse(simplifiedContent);
      plans = parsedContent.slides?.plans || [];
      console.log(
        "Fallback parsing attempt result:",
        plans.length > 0 ? "Success" : "Failed"
      );
    } catch (fallbackError) {
      console.error("Fallback parsing also failed:", fallbackError);
      plans = [];
    }
  }

  let plansText = plans.map((plan: any) => {
    if (!plan || typeof plan !== "object") return "Error: Invalid plan format";
    return `${xss(plan["lang"] || "")} && ${xss(plan["eng"] || "")}`.replace(
      /\d+/g,
      ""
    );
  });

  return plansText;
};

export let createPlansDescriptionLanguageFile = async (
  name: string,
  contentFile: string,
  model: modelLang = modelLang.gpt3
) => {
  let models = {
    "gpt-3": AI_MODEL,
    "gpt-4": AI_MODEL,
    fallback: AI_MODEL, // Fallback model if needed
  };

  let selectedModel = models["gpt-3"];
  console.log(
    `Using model: ${selectedModel} for generating content about: ${name}`
  );

  // Trim content if it's too long
  const MAX_CONTENT_SIZE = 10000;
  const trimmedContent =
    contentFile.length > MAX_CONTENT_SIZE
      ? contentFile.substring(0, MAX_CONTENT_SIZE) +
        "... (content truncated due to length)"
      : contentFile;

  const queryJson = {
    input_text: `Create comprehensive and informative content about the topic: "${name}" that strictly follows these requirements.

STRICT CONTENT REQUIREMENTS:
1. Write EXACTLY four (4) sections of content about "${name}".
2. Each section must have a unique, descriptive title relevant to the topic.
3. Each section should contain 60-70 words of informative content.
4. All content must be in the SAME LANGUAGE as the provided text sample.
5. Content must be factually accurate and comprehensive.

FORMAT REQUIREMENTS:
1. DO NOT use any question marks or interrogative sentences in titles or content.
2. DO NOT use special characters (?, !, ., :, ) in titles.
3. Use clear, concise language appropriate for presentation slides.
4. Each title must be unique and should not repeat.
5. Format content precisely according to the required JSON structure.

IMPORTANT NOTES:
- Ensure content is direct and presentation-ready
- Make titles descriptive but concise
- Return EXACTLY four sections, no more and no less
- Maintain consistent tone and language throughout
- Ensure all content is in the same language as the input text

Generate high-quality, accurate content that would be suitable for educational presentation slides.`,
    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            content: "{{content}}",
          },
          {
            title: "{{title}}",
            content: "{{content}}",
          },
          {
            title: "{{title}}",
            content: "{{content}}",
          },
          {
            title: "{{title}}",
            content: "{{content}}",
          },
        ],
      },
    },
  };

  // Implement retry mechanism
  const maxRetries = 2;
  let retryCount = 0;
  let success = false;
  let chatCompletion;

  while (!success && retryCount <= maxRetries) {
    try {
      chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: "user", content: trimmedContent },
          { role: "system", content: JSON.stringify(queryJson) },
        ],
        model: selectedModel,
        max_tokens: 1800,
        response_format: { type: "json_object" },
      });
      success = true;
    } catch (error) {
      console.error(
        `API request failed (attempt ${retryCount + 1}/${maxRetries + 1}):`,
        error
      );
      retryCount++;

      if (retryCount === 1 && selectedModel !== models["fallback"]) {
        console.log(`Switching to fallback model: ${models["fallback"]}`);
        selectedModel = models["fallback"];
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (!chatCompletion) {
    console.error("All API requests failed after retries");
    return {
      name: name,
      content: [],
    };
  }

  let description;
  try {
    const content = chatCompletion.choices[0].message.content || "";
    const parsedContent = JSON.parse(content);
    description = parsedContent.slide?.content;

    // Validate the structure
    if (
      !description ||
      !Array.isArray(description) ||
      description.length !== 4
    ) {
      console.error(
        "Error: Invalid content structure or incorrect number of sections"
      );
      throw new Error(
        "Invalid response format - doesn't match expected structure"
      );
    }

    // Validate each section has title and content
    description.forEach((section, index) => {
      if (!section.title || !section.content) {
        console.error(
          `Error: Missing title or content in section ${index + 1}`
        );
        throw new Error(`Invalid section format in section ${index + 1}`);
      }
    });
  } catch (error) {
    console.error("Error parsing JSON response:", error);

    // First fallback - retry with direct prompt as content
    if (!description && retryCount < maxRetries) {
      try {
        console.log("Attempting fallback with direct prompt...");

        const fallbackCompletion = await openai.chat.completions.create({
          messages: [{ role: "user", content: JSON.stringify(queryJson) }],
          model: selectedModel,
          max_tokens: 2000,
          response_format: { type: "json_object" },
        });

        const fallbackContent =
          fallbackCompletion.choices[0].message.content || "";
        description = JSON.parse(fallbackContent).slide?.content;
      } catch (fallbackError) {
        console.error("First fallback failed:", fallbackError);
      }
    }

    // Second fallback - try with simpler structure
    if (!description) {
      try {
        console.log("Attempting second fallback with simplified approach...");

        const simpleFallbackCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Create exactly 4 sections about "${name}". Each section should have a title and content. Format as JSON.`,
            },
          ],
          model: models["fallback"] || models["gpt-3"],
          max_tokens: 2000,
          response_format: { type: "json_object" },
        });

        const simpleContent =
          simpleFallbackCompletion.choices[0].message.content || "";
        const simpleParsed = JSON.parse(simpleContent);

        // Try to extract content from various possible structures
        description =
          simpleParsed.slide?.content ||
          simpleParsed.content ||
          simpleParsed.sections ||
          [];

        // If we found something but in wrong format, try to normalize it
        if (
          description &&
          Array.isArray(description) &&
          description.length > 0
        ) {
          description = description.slice(0, 4).map((section) => {
            if (typeof section === "object") {
              return {
                title:
                  section.title || section.heading || section.name || "Section",
                content:
                  section.content ||
                  section.text ||
                  section.description ||
                  "Content",
              };
            }
            return { title: "Section", content: String(section) };
          });
        }
      } catch (simpleFallbackError) {
        console.error("Second fallback also failed:", simpleFallbackError);
      }
    }

    // If all else fails, create placeholder content
    if (!description || !Array.isArray(description) || description.length < 4) {
      description = [
        {
          title: `${name} Overview`,
          content: `Information about ${name} would be provided here.`,
        },
        {
          title: `${name} Details`,
          content: `Detailed explanation of ${name} would be provided here.`,
        },
        {
          title: `${name} Applications`,
          content: `Applications of ${name} would be described here.`,
        },
        {
          title: `${name} Summary`,
          content: `Summary of key points about ${name} would be provided here.`,
        },
      ];
    }
  }

  return {
    name: name,
    content: description,
  };
};
