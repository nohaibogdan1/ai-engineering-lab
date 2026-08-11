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

    let textResponse = '';

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

async function main() {
  rl.on("line", async (line) => {
    if (line === EXIT) {
      rl.close();
    } else {
      await discuss(line);
    }
  });

  console.log("User: ");

  return;
}

main();
