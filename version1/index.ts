import { GoogleGenAI } from "@google/genai";

async function main() {
    console.log("fsegf")

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })

    const result = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: "Explain in two sentences how AI works"
    })

    console.log(result.output_text)

}

main()


