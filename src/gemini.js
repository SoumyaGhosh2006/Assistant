let apiKey = import.meta.env.VITE_GEMINI_API_KEY;

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// Check if API key is available
if (!apiKey || apiKey === 'your_api_key_here') {
    console.error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file");
}

const genAI = apiKey && apiKey !== 'your_api_key_here' ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    tools: [
        {
            googleSearch: {}
        }
    ]
}) : null;

const generationConfig = {
    temperature: 0.8,
    topP: 0.95,
    topK: 50,
    maxOutputTokens: 120,
    responseMimeType: "text/plain",
};

async function run(prompt) {
    try {
        // Check if API key and model are available
        if (!apiKey || apiKey === 'your_api_key_here' || !model) {
            console.error("Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file");
            return "I need to be configured with a Gemini API key to work properly. Please add your API key to the .env file.";
        }
        
        const optimizedPrompt = `You are Paimon, a friendly, jolly and helpful voice assistant. Respond conversationally and briefly (3-4 sentences max) to: ${prompt}`;
        
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        
        const result = await chatSession.sendMessage(optimizedPrompt);
        return result.response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I couldn't process that request. Please check your API key and try again.";
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
  