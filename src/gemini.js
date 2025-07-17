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
        
        const optimizedPrompt = `You are Ramlal, a friendly, jolly and helpful voice assistant. Respond conversationally and briefly (3-4 sentences max) to: ${prompt}`;
        
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

// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

// import {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
// } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({ 
//     model: "gemini-1.5-flash",
// });

// const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 8192,
//     responseMimeType: "text/plain",
// };

// async function run(prompt) {
//     try {
//         const chatSession = model.startChat({
//             generationConfig,
//             history: [],
//         });
        
//         const result = await chatSession.sendMessage(prompt);
//         return result.response.text();
//     } catch (error) {
//         console.error("Error calling Gemini API:", error);
//         return "Sorry, I couldn't process your request.";
//     }
// }

// export default run;
  