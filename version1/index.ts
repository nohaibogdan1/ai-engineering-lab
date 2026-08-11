import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.1-flash-lite";

async function main() {
    const question = process.argv[2];

    if (!question) {
        console.error("Please provide a question")
        return;
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })

    const firstInput = "My name is Bogdan";

    const result = await ai.interactions.create({
        model: MODEL,
        input: firstInput
    })

    console.log(result.output_text, "\n\n")

    const secondInput = "What is my name?";

    const result2 = await ai.interactions.create({
        model: MODEL,
        input: secondInput
    })

    console.log(result2.output_text, "\n\n")

    const conversation = [
        {type: "user_input" as const, content: [{type: "text" as const, text: firstInput}]}, 
        {type: "model_output" as const, content: [{type: "text" as const, text: result.output_text || ""}]}, 
        {type: "user_input" as const, content: [{type: "text" as const, text: secondInput}]}
    ];

    const result3 = await ai.interactions.create({
        model: MODEL,
        input: conversation
    })

    console.log(result3.output_text, "\n\n")
}

main()


