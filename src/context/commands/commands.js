
export const commands = {
    websites: {
      patterns: [
        { keywords: ["open", "youtube"], url: "https://www.youtube.com", name: "YouTube" },
        { keywords: ["open", "google"], url: "https://www.google.com", name: "Google" },
        { keywords: ["open", "facebook"], url: "https://www.facebook.com", name: "Facebook" },
        { keywords: ["open", "instagram"], url: "https://www.instagram.com", name: "Instagram" },
        { keywords: ["open", "twitter"], url: "https://www.twitter.com", name: "Twitter" },
        { keywords: ["open", "linkedin"], url: "https://www.linkedin.com", name: "LinkedIn" },
        { keywords: ["open", "netflix"], url: "https://www.netflix.com", name: "Netflix" },
        { keywords: ["open", "spotify"], url: "https://www.spotify.com", name: "Spotify" },
        { keywords: ["open", "amazon"], url: "https://www.amazon.com", name: "Amazon" },
        { keywords: ["open", "github"], url: "https://www.github.com", name: "GitHub" },
        { keywords: ["open", "reddit"], url: "https://www.reddit.com", name: "Reddit" },
        { keywords: ["open", "wikipedia"], url: "https://www.wikipedia.org", name: "Wikipedia" },
        { keywords: ["open", "gmail"], url: "https://www.gmail.com", name: "Gmail" },
        { keywords: ["open", "whatsapp"], url: "https://web.whatsapp.com", name: "WhatsApp Web" },
      ]
    },
    
    system: {
      patterns: [
        { keywords: ["time"], handler: "getTime" },
        { keywords: ["date"], handler: "getDate" },
        { keywords: ["what", "name"], handler: "getName" },
        { keywords: ["change", "name", "to"], handler: "changeName" },
        { keywords: ["battery"], handler: "getBattery" },
        { keywords: ["search"], handler: "searchGoogle" },
      ]
    }
  };
  
  export const systemHandlers = {
    getTime: (speak, setResponse, setPrompt, setSpeaking) => {
      const time = new Date().toLocaleString(undefined, {hour: "numeric", minute: "numeric"});
      speak(time);
      setResponse(true);
      setPrompt(time);
      setTimeout(() => setSpeaking(false), 5000);
    },
    
    getDate: (speak, setResponse, setPrompt, setSpeaking) => {
      const date = new Date().toLocaleString(undefined, {day: "numeric", month: "short"});
      speak(date);
      setResponse(true);
      setPrompt(date);
      setTimeout(() => setSpeaking(false), 5000);
    },
    
    getName: (speak, setResponse, setPrompt, setWaitingForClick, ASSISTANT_NAME) => {
      speak(`My name is ${ASSISTANT_NAME}`);
      setResponse(true);
      setPrompt(`My name is ${ASSISTANT_NAME}`);
      setWaitingForClick(true);
    },
    
    changeName: (speak, setAssistantName, command) => {
      const newName = command.split("change name to ")[1];
      setAssistantName(newName);
      speak(`Okay, I'll be ${newName} from now on`);
    },
    
    
    getBattery: (speak, setResponse, setPrompt, setSpeaking) => {
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          const level = Math.round(battery.level * 100);
          speak(`Battery level is ${level} percent`);
          setResponse(true);
          setPrompt(`Battery: ${level}%`);
          setTimeout(() => setSpeaking(false), 5000);
        });
      } else {
        speak("Battery information is not available");
        setResponse(true);
        setPrompt("Battery info not available");
        setTimeout(() => setSpeaking(false), 5000);
      }
    },
  
    searchGoogle: (speak, setResponse, setPrompt, setSpeaking, command) => {
      const searchQuery = command.replace(/^search\s+/i, '');
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(searchUrl, "_blank");
      speak(`Searching for ${searchQuery}`);
      setResponse(true);
      setPrompt(`Searching for ${searchQuery}...`);
      setTimeout(() => setSpeaking(false), 5000);
    }
  };