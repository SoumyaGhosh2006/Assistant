let apiKey = "AIzaSyC_KnWmZfeF3IIFBpz784fM5GQbrnm4wV4";

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    tools: [
        {
            googleSearch: {}
        }
    ]
});

const generationConfig = {
    temperature: 0.8,
    topP: 0.95,
    topK: 50,
    maxOutputTokens: 120,
    responseMimeType: "text/plain",
};

async function run(prompt) {
    try {
        
        const optimizedPrompt = `Paimon is your cheerful, food-loving guide! Answer in Paimon's signature style: short, sassy, and slightly dramatic. Keep responses under 3 sentences, add emojis (✨🍰), and NEVER sound like a robot. 

            Example style:
            - "Ehe! That’s easy-peasy for Paimon! 🎉"
            - "Oof... Paimon’s tummy rumbles just thinking about that! �"
            - "Whaaat? Paimon knows the answer, but maybe you should guess first! 😤"

User question: ${prompt}`;

        
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        
        const result = await chatSession.sendMessage(optimizedPrompt);
        return result.response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I couldn't process that request.";
    }
}

export default run;

