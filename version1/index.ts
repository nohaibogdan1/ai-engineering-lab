import { createInterface } from "node:readline";

import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.1-flash-lite";

const EXIT = "exit";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const conversation = [];

function addUserInput(input: string) {
  conversation.push({
    type: "user_input" as const,
    content: [{ type: "text" as const, text: input }],
  });
}

function addModelOutput(output: string) {
  conversation.push({
    type: "model_output" as const,
    content: [{ type: "text" as const, text: output }],
  });
}

const aiInteractionsMock = {
  create: async (args: any): Promise<{ output_text: string }> => {
    return new Promise((accept) => {
      setTimeout(() => {
        accept({ output_text: "mocked answer" });
      }, 1000);
    });
  },
};

function getTextOutput(event: any): string | undefined {
  if (event.event_type !== "step.delta") {
    return;
  }

  if (event.delta.type === "text") {
    return event.delta.text;
  }
}

async function discuss(userInput: string) {
  if (!userInput) {
    return;
  }

  addUserInput(userInput);

  try {
    const resultStream = await ai.interactions.create({
      model: MODEL,
      input: conversation,
      stream: true,
    });

    console.log("Ai: ");

    let textResponse = "";

    for await (const event of resultStream) {
      const text = getTextOutput(event);
      if (text) {
        textResponse += text;
        console.log(text);
      }
    }

    addModelOutput(textResponse);
  } catch (err) {
    console.log("Ups , an error appeared", err);
  }
}

function chat() {
  rl.on("line", async (line) => {
    if (line === EXIT) {
      rl.close();
    } else {
      await discuss(line);
    }
  });

  console.log("User: ");
}

const outputSchema = {
  name: "string",
  age: "number",
  occupation: "string",
  city: "string",
};

async function llmStructuredOutput() {
  const result = await ai.interactions.create({
    model: MODEL,
    input:
      "John is old and works as a software engineer. He lives in Bucharest. He has two kids, a daughter and a son",
    response_format: {
      mime_type: "application/json",
      type: "text",
      schema: outputSchema,
    },
  });

  console.log("result", result.output_text);
}

async function main() {
  // chat();

  llmStructuredOutput();

  return;
}

main();
