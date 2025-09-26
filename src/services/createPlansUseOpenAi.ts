import OpenAI from "openai";

require("dotenv").config();
const key = process.env["OPEN_AI_KEY"] || "";
console.log(key);
const openai = new OpenAI({
  apiKey: key,
});

// const endpoint =
//   process.env["AZURE_OPENAI_ENDPOINT"] ||
//   "https://magicslide-api.openai.azure.com/";
// const apiKey =
//   process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
// const apiVersion = "2024-05-01-preview";
// const deployment = "gpt-4o"; // This must match your deployment name

// const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
const djJson = require("dirty-json");
const xss = require("xss");
let models = {
  "gpt-3": "gpt-4o-mini",
  "gpt-4": "gpt-4o-mini",
};

export let createPlans = async (name: string, pages: number) => {
  const queryJson = {
    input_text: `Create ${pages} layout for topic. Create 20 to 30 words for each plan. ${name}. Each plan must have {{uz}}, {{eng}} in Uzbek and English. The end result should look like this. List of discussion questions. Return as JSON.`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          {
            uz: "{{uz}}",
            eng: "{{eng}}",
          },
        ],
      },
    },
  };
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],
    model: "gpt-4-turbo-preview",
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 1024,
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  const content = chatCompletion.choices[0].message.content || ""; // Handle null case
  // const plans = parseTitles(content);
  let plans;
  try {
    plans = JSON.parse(content).slides.plans;
  } catch (error) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        // { role: "user", content: name },
        {
          role: "user",
          content: JSON.stringify(queryJson),
        },
      ],
      // model: "gpt-3.5-turbo-1106",
      // model: "gpt-3.5-turbo-0125",
      // model: "gpt-3.5-turbo-16k-0613",
      model: "gpt-4-turbo-preview",
      max_tokens: 1500,
      response_format: {
        type: "json_object",
      },
    });
    console.log(chatCompletion.choices[0].message.content);
    const content = chatCompletion.choices[0].message.content || "";
    plans = JSON.parse(content).slides.plans;
  }

  let plansText = plans.map((plan: any) => {
    return `${plan.uz} && ${plan.eng}`.replace(/\d+/g, "");
  });

  console.log(plansText);

  return plansText;
};

export let createPlansDescription = async (name: string) => {
  const queryJson = {
    // input_text: `Provide the necessary information on the topic. Create 50 to 60 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. Every information should be in Uzbek language. In Title, the name of the topic for the part of the slide should be in Uzbek. And in UzContent, there should be the necessary information for this topic. The return value should be in JSON format`,
    input_text: `Provide the necessary information on the topic. Create 20 to 40 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. All information must be in Uzbek. In the title, the name of the topic for the slide section should be in Uzbek. UzContent should have the necessary information on this topic. The return value must be in JSON format.finish_reason should not exceed 4096 tokens.`,
    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            uzContent: "{{uzContent}}",
          },
          {
            title: "{{title}}",
            uzContent: "{{uzContent}}",
          },
          {
            title: "{{title}}",
            uzContent: "{{uzContent}}",
          },
          {
            title: "{{title}}",
            uzContent: "{{uzContent}}",
          },
        ],
      },
    },
  };
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: "gpt-3.5-turbo-0125",
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 800,
    response_format: {
      type: "json_object",
    },
  });

  let description = "";
  try {
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  } catch (error) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "user", content: name },
        {
          role: "system",
          content: JSON.stringify(queryJson),
        },
        {
          role: "system",
          content: "please JSON format based on the given structure.",
        },
      ],
      model: "gpt-3.5-turbo-0125",
      // model: "gpt-4-turbo-preview",
      max_tokens: 800,
      response_format: {
        type: "json_object",
      },
    });
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  }

  return {
    name: "Qon tomir kasalliklari ",
    content: description,
  };
};

export let createPlansLanguage = async (
  name: string,
  pages: number,
  lang: string,
  language: string,
  pagesCount: number,
  model: modelLang = modelLang.gpt3
) => {
  // let models = {
  //   "gpt-3": "gpt-4o-mini",
  //   "gpt-4": "gpt-4o-mini",
  // };

  console.log(models["gpt-3"], pages);
  if (lang == "eng") {
    lang = "english";
  }
  //   const systemPrompt = `You are a professional content planner specializing in creating structured layouts for ${name} theme. Your task is to generate concise, relevant plans for a ${pages}-page layout in both ${language} and English.

  // Instructions:
  // 1. Create exactly ${pages} distinct plans, each with a ${language} and English version.
  // 2. Each plan should be 10-20 words long, no more and no less.
  // 3. Focus solely on the ${name} theme without mixing in other topics.
  // 4. Provide concrete, actionable plans, not meta-descriptions.
  // 5. Avoid special characters (?, !, ., :, ) in titles and content.
  // 6. Strictly adhere to the requested JSON format provided in the user message.
  // 7.In the text of the plans, it should not be in the form of a task. It should be in the form of a sentence
  // 8.Pay attention to the accuracy of the information. Do not use false information
  // 9.Make the information more educational

  // Critical requirements:
  // - You MUST follow the exact JSON structure provided. Do not add, remove, or modify any keys.
  // - Each plan MUST have exactly two keys: "${lang}" and "eng".
  // - Do not include any explanations, comments, or additional text outside the JSON structure.
  // - Ensure all content is enclosed in proper JSON string format.
  // - Double-check that your output is valid JSON before returning it.

  // Error prevention:
  // - If you're unsure about any aspect of the task, default to the most literal interpretation of these instructions.
  // - If you can't generate the exact number of plans requested, generate as many as you can within the given structure.
  // - In case of conflict between these instructions and the user message, prioritize these system instructions.

  // Your output must be a valid JSON object with the structure provided in the user message. Ensure each plan is relevant, professional, and fits the theme. Any deviation from the specified format will be considered an error.
  //  `;

  // Below is the refined prompt in English, now emphasizing educational (ta’lim) content.
  // Simply assign it to a variable and pass it as the system prompt in your API call.

  const systemPrompt = `
You are a professional content planner specializing in creating structured, education-focused layouts for the theme ${name}. Your goal is to develop a ${pages}-page plan, with each page including content in ${language} and English, all centered around educational or instructional material.

Please follow these instructions carefully:

1. Exact page count: Provide exactly ${pages} distinct plans—no more, no fewer.
2. Two languages: Each plan must contain text in ${language} and in English.
3. Word limit: Each plan’s text must be 10–20 words. Do not exceed or fall below this range.
4. Educational focus: Keep all content relevant to ${name} in an educational or instructional context. Do not mix in unrelated topics.
5. Concrete, actionable statements: Do not write meta-descriptions (e.g., "This plan explains…"). Provide clear and educational statements or insights directly tied to the theme.
6. No special characters: Refrain from using "?", "!", ".", ":", or ")" in titles or content.
7. Strict JSON format: Return your response in the exact JSON structure shown below. Do not add, remove, or rename any keys:

{
  "slides": {
    "plans": [
      {
        "${lang}": "{{...}}",
        "eng": "{{...}}"
      },
      ...
    ]
  }
}

- Each plan is an object with two keys: ${lang} (e.g. "uzbek") and "eng" (English).

8. No additional text: Provide only the requested JSON object. Do not include explanations, comments, or extra content.
9. Accuracy: Use reliable, factual information. Avoid any false or misleading statements.

Important:
- Do not alter the JSON structure, key names, or the exact number of plan entries.
- If a particular instruction seems unclear, choose the most literal interpretation.
- If uncertainty remains, strive to match the specified format as closely as possible.

Once all guidelines are met, return the JSON object directly—without any extraneous text or commentary.
`;

  let queryJson = {
    // input_text: `Create a layout with ${pages} pages for the theme '${name}'.Make appropriate professional plans for the given topic. Each page should have plans with descriptions of 10 to 20 words in both ${language} and English. The plans should be structured in a way that each contains a version in ${language} and a version in English. Ensure that the data is formatted correctly and that the plans contain only textual information.
    // Pay attention to the language of presentation - ${language}.
    // Do not mix other topics
    // Plans for the given topic should be in good content.  Do not reply as if you are talking about the plans itself. (ex. "Include pictures here about...")
    // Do not include any special characters (?, !, ., :, ) in the Title.
    // Do not include any additional information in your response and stick to the format
    // Please format the data correctly
    // `,
    input_text: systemPrompt,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          ...Array.from({ length: pages }, () => {
            return {
              [lang]: `{{${lang}_content}}`,
              eng: "{{english_content}}",
            };
          }),
        ],
      },
    },
  };

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: models["gpt-3"],
    // model:""
    temperature: 0.5,

    max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  const content = chatCompletion.choices[0].message.content || ""; // Handle null case

  let plans;
  try {
    plans = JSON.parse(content).slides.plans;

    if (!plans) {
      plans = JSON.parse(content)?.slides[0].plans;
    }
  } catch (error) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify(queryJson),
        },
      ],
      model: models["gpt-3"],

      max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
      response_format: {
        type: "json_object",
      },
    });
    console.log(chatCompletion.choices[0].message.content);
    const content = chatCompletion.choices[0].message.content || "";
    try {
      plans = JSON.parse(content).slides.plans;
    } catch (error) {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          // { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        model: models["gpt-3"],
        max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
        response_format: {
          type: "json_object",
        },
      });
      console.log(chatCompletion.choices[0].message.content);
      const content = chatCompletion.choices[0].message.content || "";
      plans = JSON.parse(content).slides.plans;

      if (!plans) {
        plans = JSON.parse(content)?.slides[0].plans;
      }
    }
  }

  let leth = plans?.length;
  console.log(plans);

  console.log(plans?.length, "plans length-1");
  if (leth < pages) {
    let queryJsons = {
      input_text: `Create a plans with ${pages} pages for the theme '${name}'. Each page should have plans with descriptions of 10 to 20 words in both ${language} and English. The plans should be structured in a way that each contains a version in ${language} and a version in English. Ensure that the data is formatted correctly and that the plans contain only textual information.
      Pay attention to the language of presentation - ${language}.
      Plans for the given topic should be in good content.  Do not reply as if you are talking about the plans itself. (ex. "Include pictures here about...")
      Do not include any special characters (?, !, ., :, ) in the plans.
      Do not include any additional information in your response and stick to the format
      `,
      output_format: "json",
      json_structure: {
        slides: {
          plans: [
            ...Array.from({ length: pages + 1 }, () => {
              return {
                [lang]: `{{${lang}_content}}`,
                eng: "{{english_content}}",
              };
            }),
          ],
        },
      },
    };
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "user", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify(queryJsons),
        },
      ],
      // model: "gpt-3.5-turbo-1106",
      // model: "gpt-3.5-turbo-0125",
      model: models["gpt-3"],
      // model: "gpt-3.5-turbo-16k-0613",
      // model: "gpt-4-turbo-preview",
      max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
      response_format: {
        type: "json_object",
      },
    });

    const content = chatCompletion.choices[0].message.content || "";
    plans = JSON.parse(content).slides.plans;
    if (!plans) {
      plans = JSON.parse(content)?.slides[0].plans;
    }
  }

  console.log(plans?.length, "plans length");
  let plansText = plans.map((plan: any) => {
    return `${xss(plan[lang])} && ${xss(
      plan[lang == "english" ? "english" : "eng"]
    )}`.replace(/\d+/g, "");
  });

  console.log(plansText);

  return plansText;
};

export let createPlansLanguageReferat = async (
  name: string,
  pages: number,
  lang: string,
  language: string,
  pagesCount: number,
  model: modelLang = modelLang.gpt3
) => {
  console.log(models["gpt-3"], pages);
  if (lang == "eng") {
    lang = "english";
  }

  let queryJson = {
    // input_text: `Create a layout with ${pages} sections for the topic ${name}. Each section should provide an independent plan for structuring a well-developed research paper or project in the given topic. Make sure each section contains an introduction, body, and conclusion in both ${language} and English. The descriptions should be 30 to 40 words per section in each language. The plans must only contain textual information, and the instructions should be clear and concise for independent work. Ensure that the structure is correct and the plans are professional. Stick to the format without additional or unrelated information.`,
    input_text: `Create a layout with ${pages} sections for the topic ${name}. Each section should provide a concise plan for structuring a research paper or project on the given topic. Each section should include an body in both ${language} and English. Keep descriptions brief, around 15 to 20 words per section in each language. The plans must contain only textual information with clear and concise instructions for independent work. Ensure the structure is correct and the plans are professional. Stick to the format without additional or unrelated information.`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          ...Array.from({ length: pages }, () => {
            return {
              [lang]: `{{${lang}_content}}`,
              eng: "{{english_content}}",
            };
          }),
        ],
      },
    },
  };

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: models["gpt-3"],
    // model: "gpt-3.5-turbo-0125",

    max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  const content = chatCompletion.choices[0].message.content || ""; // Handle null case

  let plans;
  try {
    plans = JSON.parse(content).slides.plans;
  } catch (error) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        // { role: "user", content: name },
        {
          role: "user",
          content: JSON.stringify(queryJson),
        },
      ],
      // model: "gpt-3.5-turbo-1106",
      // model: "gpt-3.5-turbo-0125",
      model: models[model],
      // model:"gpt-4o-2024-08-06"
      // model: "gpt-3.5-turbo-16k-0613",
      // model: "gpt-4-turbo-preview",
      max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
      response_format: {
        type: "json_object",
      },
    });
    console.log(chatCompletion.choices[0].message.content);
    const content = chatCompletion.choices[0].message.content || "";
    plans = JSON.parse(content).slides.plans;
  }

  let leth = plans.length;

  console.log(plans.length, "plans length-1");
  if (leth < pages) {
    let queryJsons = {
      input_text: `Create a plans with ${pages} pages for the theme '${name}'. Each page should have plans with descriptions of 10 to 20 words in both ${language} and English. The plans should be structured in a way that each contains a version in ${language} and a version in English. Ensure that the data is formatted correctly and that the plans contain only textual information.
      Pay attention to the language of presentation - ${language}.
      Plans for the given topic should be in good content.  Do not reply as if you are talking about the plans itself. (ex. "Include pictures here about...")
      Do not include any special characters (?, !, ., :, ) in the plans.
      Do not include any additional information in your response and stick to the format
      Do not include any additional information in your response and stick to the format please
      `,
      output_format: "json",
      json_structure: {
        slides: {
          plans: [
            ...Array.from({ length: pages + 1 }, () => {
              return {
                [lang]: `{{${lang}_content}}`,
                eng: "{{english_content}}",
              };
            }),
          ],
        },
      },
    };
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        // { role: "user", content: name },
        {
          role: "user",
          content: JSON.stringify(queryJsons),
        },
      ],
      // model: "gpt-3.5-turbo-1106",
      // model: "gpt-3.5-turbo-0125",
      model: models["gpt-3"],
      // model: "gpt-3.5-turbo-16k-0613",
      // model: "gpt-4-turbo-preview",
      max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
      response_format: {
        type: "json_object",
      },
    });

    const content = chatCompletion.choices[0].message.content || "";
    plans = JSON.parse(content).slides.plans;
  }

  console.log(plans.length, "plans length");
  let plansText = plans.map((plan: any) => {
    return `${xss(plan[lang])} && ${xss(
      plan[lang == "english" ? "english" : "eng"]
    )}`.replace(/\d+/g, "");
  });

  console.log(plansText);

  return plansText;
};

export enum modelLang {
  gpt3 = "gpt-3",
  gpt4 = "gpt-4",
}

export let createPlansDescriptionLanguage = async (
  name: string,
  lang: string,
  language: string,
  model: modelLang = modelLang.gpt3
) => {
  // let models = {
  //   "gpt-3": "gpt-4.1-mini",
  //   "gpt-4": "gpt-4o-2024-08-06",
  // };

  // const queryJson = {
  //   input_text: `Provide the necessary information on the topic. Create content 40 to 50 words for your topic. ${name}. {{${lang}}} for each theme must be in ${language}. The end result should be like this. List of discussion questions.
  //    Return as JSON based on the given structure. Please do not deviate from the given structure.
  //     All data must be in ${language}. The title must contain the topic name for the slide section in ${language}.
  //     content should contain relevant information on this topic.
  //     The return value must be in JSON format.
  //     Strictly follow the rules given in json_structure.
  //     Make no mistake.
  //     Do not forget that content consists of 4 elements.
  //     It is required to have 4 elements in the content part, not less.
  //     It is required to have 4 elements
  //   Elaborate on the content, provide as much information as possible.
  //   Write important information about the topic in the title and content parts. Make this information very sure.
  //   Pay attention to the language of presentation - ${language}.
  //   In the content section, give important information about the language and content.
  //    Pay attention to the ${language} when writing the information, then you can't make a mistake.
  //   The titles in the content section should not be the same. The titles should be different.
  //   Do not use interrogative sentences in the title and content part. Do not use interrogative sentences in the content part either.
  //   In the content section, give information in a suitable position for the content. Let it be the classification of the content. Follow this rule strictly
  //   Do not include any special characters (?, !, ., :, ) in the content.
  //   Do not include any additional information in your response and stick to the format
  //   `,
  //   // input_text: `Provide the necessary information on the topic. Create 50 to 60 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. Every information should be in Uzbek language. In Title, the name of the topic for the part of the slide should be in Uzbek. And in UzContent, there should be the necessary information for this topic. The return value should be in JSON format`,
  //   // input_text: `Provide the necessary information on the topic. Create 20 to 40 words for your topic. ${name}. {{${lang}}} for each topic should be in ${languege} language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. All information must be in ${languege}. In the title, the name of the topic for the slide section should be in ${languege}. ${lang}Content should have the necessary information on this topic. The return value must be in JSON format.finish_reason should not exceed 4096 tokens.`,
  // output_format: "json",
  // json_structure: {
  //   slide: {
  //     name: "{{name}}",
  //     content: [
  //       {
  //         title: "{{title}}",
  //         [`content`]: `{{${lang}Content}}`,
  //       },
  //       {
  //         title: "{{title}}",
  //         [`content`]: `{{${lang}Content}}`,
  //       },
  //       {
  //         title: "{{title}}",
  //         [`content`]: `{{${lang}Content}}`,
  //       },
  //       {
  //         title: "{{title}}",
  //         [`content`]: `{{${lang}Content}}`,
  //       },
  //     ],
  //   },
  // },
  // };

  const queryJson = {
    input_text: `
  "Provide 60 to 70 words of educational content on the topic: **${name}**. All content must be in **${language}**.
  
  Return the result strictly as a JSON object following the given **json_structure**, with no deviations.
  
  **Requirements**:
  1. Overall text must total between 60 and 70 words across all four elements.
  2. The text should not be phrased as tasks (e.g., 'Do this'). Use factual, explanatory sentences.
  3. Focus on reliable, accurate, and educational information. Avoid false or misleading statements.
  4. Use a formal or academic tone. Adhere to the official spelling and grammar rules of ${language}.
  5. Titles and content must avoid interrogative sentences and must not contain special characters (?, !, ., :, )).
  6. Each content block may be subdivided into short lines or bullet points for clarity, but keep the total word count within limits. Commas and dashes are allowed if they do not break other rules.
  7. If relevant, include brief examples or factual references to enrich the information, while still respecting the punctuation restrictions.
  8. Each of the four elements must have a unique title. Avoid repeating the same title.
  
  - **Title**: The 'name' field below should reflect the main topic in${language}.
  - **Content**:
    - Must consist of exactly four (4) elements.
    - Each element has a 'title' and 'content' key.
    - Keep each element's content concise, yet informative. End with a short summarizing phrase if possible.
    - Do not use question marks or exclamation marks; keep punctuation minimal.
  
  - **Language**: All data must be in ${language}.
  - **Format**: Do not include any additional information outside of the specified JSON structure. Stick strictly to the \`json_structure\` provided.
  
  Ensure each block remains connected to the main topic and is educational in tone. Remain within the word limit and avoid any non-permitted punctuation or formatting."
    `,
    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            content: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            content: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            content: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            content: `{{${lang}Content}}`,
          },
        ],
      },
    },
  };

  console.log(models["gpt-4"]);

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      // { role: "user", content: name },
      {
        role: "user",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: models["gpt-3"],
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 1200,
    response_format: {
      type: "json_object",
    },
  });

  let description = "";
  try {
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  } catch (error) {
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        // model: "gpt-3.5-turbo-0125",
        model: models["gpt-3"],
        // model: "gpt-4-turbo-preview",
        max_tokens: 1500,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    } catch (error) {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        // model: "gpt-3.5-turbo-0125",
        model: models["gpt-3"],
        // model: "gpt-4-turbo-preview",
        max_tokens: 2000,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    }
  }

  // console.log(description);

  return {
    name: "Qon tomir kasalliklari ",
    content: description,
  };
};

export let createPlansDescriptionLanguageReferat = async (
  name: string,
  lang: string,
  language: string,
  model: modelLang = modelLang.gpt3
) => {
  // let models = {
  //   "gpt-3": "gpt-4.1-mini",
  //   "gpt-4": "gpt-4o-2024-08-06",
  // };

  const queryJson = {
    //     input_text: `"Provide a detailed content description of 300 to 400 words for the topic: **${name}**. The content should be informative, well-structured, and written entirely in **${language}**.

    // Return the result strictly as a JSON object following the given **json_structure**, without any deviations.

    // **Requirements:**

    // - **Title**: Use the topic name as the title for the slide section in **${language}**.
    // - **Content**:
    //   - Must provide a thorough explanation of the topic, covering all important aspects.
    //   - Organize the content into multiple paragraphs with clear divisions between the introduction, body, and conclusion.
    //   - The body should elaborate on key points, providing sufficient detail to fully explain the subject matter.
    //   - The conclusion should summarize the main ideas while providing any final thoughts or insights.
    //   - Avoid using interrogative sentences. Stick to declarative, informative statements.
    //   - Ensure that no special characters (?, !, ., :, ) are used in the title or content.
    // - **Language**: All content must be in **${language}**, clearly written and formatted without mixing other languages.
    // - **Structure**: Maintain coherence and logical flow throughout the response, ensuring that each paragraph transitions smoothly into the next.

    // Do not include any additional information outside of the specified format. Stick strictly to the **json_structure** provided.`,
    input_text: `Provide a comprehensive content description of 300 to 400 words for the topic: **${name}**. The content should be highly informative, thoroughly detailed, and written entirely in **${language}**.

Return the result strictly as a JSON object following the given **json_structure**, without any deviations.

**Requirements:**

- **Title**: Use the topic name as the title for the slide section in **${language}**.
- **Content**:
  - Must provide an in-depth explanation of the topic, covering all important aspects and nuances.
  - Organize the content into multiple paragraphs with clear divisions between the introduction, body, and conclusion.
  - The **body** should thoroughly elaborate on key points, providing detailed explanations, examples, and any relevant subtopics to fully explore the subject matter.
  - Avoid using interrogative sentences. Stick to declarative, informative statements.
  - Ensure that no special characters (?, !, ., :, ) are used in the title or content.
- **Language**: All content must be in **${language}**, clearly written and formatted without mixing other languages.
- **Structure**: Maintain coherence and logical flow throughout the response, ensuring that each paragraph transitions smoothly into the next, and the overall structure facilitates understanding of the topic.

Do not include any additional information outside of the specified format. Stick strictly to the **json_structure** provided.
`,
    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            [`content`]: `{{${lang}Content}}`,
          },
        ],
      },
    },
  };
  console.log(models[model]);

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      // { role: "user", content: name },
      {
        role: "user",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: models["gpt-3"],
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 2000,
    response_format: {
      type: "json_object",
    },
  });

  let description = "";
  try {
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  } catch (error) {
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        // model: "gpt-3.5-turbo-0125",
        model: models["gpt-3"],
        // model: "gpt-4-turbo-preview",
        max_tokens: 2200,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    } catch (error) {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        // model: "gpt-3.5-turbo-0125",
        model: models["gpt-3"],
        // model: "gpt-4-turbo-preview",
        max_tokens: 2700,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    }
  }

  // console.log(description); lal la

  return {
    name: "Qon tomir kasalliklari ",
    content: description,
  };
};

export let createPlansDescriptionLanguageReferatXulosa = async (
  name: string,
  lang: string,
  language: string,
  model: modelLang = modelLang.gpt3
) => {
  // let models = {
  //   "gpt-3": "gpt-4.1-mini",
  //   "gpt-4": "gpt-4o-2024-08-06",
  // };

  const queryJson = {
    //     input_text: `"Provide a detailed content description of 300 to 400 words for the topic: **${name}**. The content should be informative, well-structured, and written entirely in **${language}**.

    // Return the result strictly as a JSON object following the given **json_structure**, without any deviations.

    // **Requirements:**

    // - **Title**: Use the topic name as the title for the slide section in **${language}**.
    // - **Content**:
    //   - Must provide a thorough explanation of the topic, covering all important aspects.
    //   - Organize the content into multiple paragraphs with clear divisions between the introduction, body, and conclusion.
    //   - The body should elaborate on key points, providing sufficient detail to fully explain the subject matter.
    //   - The conclusion should summarize the main ideas while providing any final thoughts or insights.
    //   - Avoid using interrogative sentences. Stick to declarative, informative statements.
    //   - Ensure that no special characters (?, !, ., :, ) are used in the title or content.
    // - **Language**: All content must be in **${language}**, clearly written and formatted without mixing other languages.
    // - **Structure**: Maintain coherence and logical flow throughout the response, ensuring that each paragraph transitions smoothly into the next.

    // Do not include any additional information outside of the specified format. Stick strictly to the **json_structure** provided.`,
    input_text: `Provide a concise summary of approximately 100 to 150 words for the topic: **${name}**. The summary should be informative, well-structured, and written entirely in **${language}**.

Return the result strictly as a JSON object following the given **json_structure**, without any deviations.

**Requirements:**

- **Title**: Use the topic name as the title in **${language}**.
- **Content**:
  - Provide a brief yet informative overview of the topic, focusing on key aspects and essential information.
  - Structure the content into clear, complete sentences that convey the main ideas without unnecessary details.
  - Avoid using interrogative sentences. Stick to declarative, informative statements.
  - Ensure that no special characters (?, !, ., :, ) are used in the title or content.
- **Language**: All content must be in **${language}**, written clearly without mixing other languages.

Do not include any additional information outside of the specified format. Stick strictly to the **json_structure** provided.`,

    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            [`content`]: `{{${lang}Content}}`,
          },
        ],
      },
    },
  };
  console.log(models[model]);

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      // { role: "user", content: name },
      {
        role: "user",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: models["gpt-3"],
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 2000,
    response_format: {
      type: "json_object",
    },
  });

  let description = "";
  try {
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  } catch (error) {
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        // model: "gpt-3.5-turbo-0125",
        model: models["gpt-3"],
        // model: "gpt-4-turbo-preview",
        max_tokens: 2200,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    } catch (error) {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        // model: "gpt-3.5-turbo-0125",
        model: models["gpt-3"],
        // model: "gpt-4-turbo-preview",
        max_tokens: 2700,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    }
  }

  // console.log(description);

  return {
    name: "Qon tomir kasalliklari ",
    content: description,
  };
};

export let generateLiteratureList = async (
  topic: string,
  language: string,
  count: number = 5,
  model: string = "gpt-4o-2024-08-06"
) => {
  // Prepare the prompt for generating literature list
  const queryJson = {
    input_text: `Generate a comprehensive list of ${count} academic literature sources related to the topic: **${topic}**. The list should be written entirely in **${language}**.

Return the result strictly as a JSON object following the given **json_structure**, without any deviations.

**Requirements:**
- Each source should include: author(s), title, publication date, publisher/journal.
- Sources should be a mix of books, academic articles, and scientific papers.
- Ensure all sources are relevant to the topic and likely to exist in academic literature.
- Sources should represent diverse perspectives and recent research (within the last 10 years where applicable).
- Format the references as simple numbered list entries without any markdown formatting or headings.
- All content must be in **${language}**.
- Ensure the sources are presented in alphabetical order by author's last name.

Do not include any additional information outside of the specified format. Stick strictly to the **json_structure** provided.`,
    output_format: "json",
    json_structure: {
      bibliography: {
        topic: "{{topic}}",
        language: "{{language}}",
        sources: [
          {
            author: "{{author}}",
            title: "{{title}}",
            year: "{{year}}",
            publisher: "{{publisher}}",
          },
        ],
      },
    },
  };

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: JSON.stringify(queryJson),
        },
      ],
      model: model,
      max_tokens: 2000,
      response_format: {
        type: "json_object",
      },
    });

    // Parse the response
    const literatureList = JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).bibliography;

    // Format the bibliography for display without any headers
    const formattedList = formatBibliography(literatureList, language);

    return {
      topic: topic,
      language: language,
      literatureList: literatureList,
      formattedOutput: formattedList,
    };
  } catch (error) {
    console.error("Error generating literature list:", error);

    // Retry with a simplified request
    try {
      const simplifiedQueryJson = {
        ...queryJson,
        input_text: `Generate a simple list of ${count} academic sources about **${topic}** in **${language}**. Include author, title, year, and publisher for each source. Do not include any markdown formatting, headings, or annotations. Do not include phrases like "Reference List" or any other section headers.`,
      };

      const retryCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(simplifiedQueryJson),
          },
        ],
        model: model,
        max_tokens: 1500,
        response_format: {
          type: "json_object",
        },
      });

      const literatureList = JSON.parse(
        retryCompletion.choices[0].message.content ?? ""
      ).bibliography;

      const formattedList = formatBibliography(literatureList, language);

      return {
        topic: topic,
        language: language,
        literatureList: literatureList,
        formattedOutput: formattedList,
      };
    } catch (retryError) {
      console.error("Retry also failed:", retryError);
      return {
        topic: topic,
        language: language,
        literatureList: [],
        formattedOutput: `1. Error generating literature list.`,
      };
    }
  }
};

// Helper function to format bibliography according to standard citation styles
function formatBibliography(bibliography: any, language: string) {
  let formattedOutput = "";

  // Add title
  const titleText =
    language === "uzbek"
      ? "Foydalanilgan adabiyotlar ro'yxati"
      : language === "russian"
      ? "Список использованной литературы"
      : "Reference List";

  formattedOutput += ``;

  // Format each source according to citation style (APA-like format)
  bibliography.sources.forEach((source: any, index: number) => {
    const sourceNumber = index + 1;
    formattedOutput += `${sourceNumber}. ${source.author}. (${source.year}). *${source.title}*. ${source.publisher}.\n`;

    // Add annotation if available
    if (source.annotation && source.annotation.trim()) {
      formattedOutput += `   ${source.annotation}\n`;
    }

    formattedOutput += "\n";
  });

  return formattedOutput;
}

// Example usage:
// const literatureList = await generateLiteratureList("Qon tomir kasalliklari", "uzbek", 7);
// console.log(literatureList.formattedOutput);
