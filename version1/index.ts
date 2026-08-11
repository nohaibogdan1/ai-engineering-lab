import { GoogleGenAI } from "@google/genai";

async function main() {
    const question = process.argv[2];

    if (!question) {
        console.error("Please provide a question")
        return;
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })

    const result = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: question
    })

    console.log(result.output_text)

}

main()


