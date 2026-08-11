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

async function discuss(userInput: string) {
  if (!userInput) {
    return;
  }

  addUserInput(userInput);

  try {
    const result = await ai.interactions.create({
      model: MODEL,
      input: conversation,
    });

    console.log("Ai: ", result.output_text);

    addModelOutput(result.output_text);
  } catch (err) {
    console.log("Ups , an error appeared");
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
