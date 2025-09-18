import React, { createContext, useState, useEffect } from 'react'      
import run from '../gemini';
import CommandProcessor from './commands/nlpCommandProcessor'; 

export const datacontext = createContext()

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.error("Speech Recognition not supported in this browser");
}

function UserContext({children}) {
  const ASSISTANT_NAME = "Ramlal";

  let [speaking, setSpeaking] = useState(false)
  let [prompt, setPrompt] = useState("Listening...")
  let [response, setResponse] = useState(false)
  let [waitingForClick, setWaitingForClick] = useState(false)
  const [isPressed, setIsPressed] = useState(false);
  const [assistantName, setAssistantName] = useState("Ramlal");
  const [generatedImage, setGeneratedImage] = useState(null);

  // Initialize NLP command processor
  const commandProcessor = new CommandProcessor();

  useEffect(() => {
    function handleGlobaltouch() {
        if (waitingForClick) {
            setSpeaking(false);
            setWaitingForClick(false);
        }
    }

    if (waitingForClick) {
      document.addEventListener('click', handleGlobaltouch);
      document.addEventListener('touchend', handleGlobaltouch);
    }

    return () => {
      document.removeEventListener('click', handleGlobaltouch);
      document.removeEventListener('touchend', handleGlobaltouch);
    };
  }, [waitingForClick]);

  function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text)
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "en-US-BrandonNeural"
    
    window.speechSynthesis.speak(text_speak)
  }

  async function aiResponse(prompt) {
    let text = await run(prompt)
    let newText = text.split("**").join("") && text.split("*").join("") && text.replace("google", "Soumya Ghosh") && text.replace("Google", "Soumya Ghosh")
    setPrompt(newText)
    speak(newText)
    setResponse(true)
    setWaitingForClick(true);
  }

  let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  let recognition = new speechRecognition()
  
  recognition.onresult = (e) => {
    let currentIndex = e.resultIndex
    let transcript = e.results[currentIndex][0].transcript
    setPrompt(transcript)
    takeCommand(transcript.toLowerCase())
  }

  function takeCommand(command) {
    const context = {
      speak,
      setResponse,
      setPrompt,
      setSpeaking,
      setWaitingForClick,
      setAssistantName,
      setGeneratedImage,
      ASSISTANT_NAME,
      aiResponse
    };
    
    // Use the NLP command processor
    commandProcessor.processCommand(command, context);
  }

  function handleRefresh() {
    // Stop any ongoing speech synthesis
    window.speechSynthesis.cancel();
    
    // Reset all states
    setSpeaking(false);
    setResponse(false);
    setPrompt("Listening...");
    setWaitingForClick(false);
    setGeneratedImage(null);
    
    // Stop speech recognition if it's running
    try {
      recognition.stop();
    } catch (error) {
      console.log("Recognition was not running");
    }
  }

  let value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
    handleRefresh,
    isPressed,
    setIsPressed,
    generatedImage,
    setGeneratedImage
  }

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  )
}

export default UserContext