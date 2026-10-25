// Node.js muhitida ishlatayotganda node-fetchni o'rnatish kerak bo'lishi mumkin
// npm install node-fetch
// const fetch = require('node-fetch');
import { AI_BASE_URL, AI_KEY, AI_MODEL, AI_REASONING_EFFORT } from "../utils/ai";
const key = AI_KEY;
export let createPlans = async (name: string, pages: number) => {
  const queryJson = {
    input_text: `Create ${pages} layout for topic. Create 20 to 30 words for each plan. ${name}. Each plan must have {{uz}}, {{eng}} in Uzbek and English. The end result should look like this. List of discussion questions. Return as JSON.`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          {
            uzTitle: "{{uzTitle}}",
            enTitle: "{{enTitle}}",
          },
        ],
      },
    },
  };

  const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`, // API kalitini qo'ying
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      reasoning: { effort: AI_REASONING_EFFORT, exclude: true },
      messages: [
        {
          role: "user",
          content: JSON.stringify(queryJson),
        },
      ],
      max_tokens: 1024,
      response_format: {
        type: "json_object",
      },
    }),
  });

  const data = await response.json();

  const content = data.choices[0].message.content || "";
  let plans = JSON.parse(content).slides.plans;
  let plansText = plans.map((plan: any) =>
    `${plan.uzTitle} && ${plan.enTitle}`.replace(/(^|&&)\s*\d+\s*[.)\-:]\s*/g, "$1 ").trim()
  );

  console.log(plansText);

  return plansText;
};
