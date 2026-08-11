import { GoogleGenAI } from "@google/genai";

async function main() {
    console.log("fsegf")

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })

    const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "what is an apple?"
    })

    console.log(result)

}

main()


