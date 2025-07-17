import { generateImage } from '../../imageService';

class CommandProcessor {
  constructor() {
    this.websites = new Map([
      ['youtube', { url: 'https://www.youtube.com', name: 'YouTube' }],
      ['google', { url: 'https://www.google.com', name: 'Google' }],
      ['facebook', { url: 'https://www.facebook.com', name: 'Facebook' }],
      ['instagram', { url: 'https://www.instagram.com', name: 'Instagram' }],
      ['twitter', { url: 'https://www.twitter.com', name: 'Twitter' }],
      ['linkedin', { url: 'https://www.linkedin.com', name: 'LinkedIn' }],
      ['netflix', { url: 'https://www.netflix.com', name: 'Netflix' }],
      ['spotify', { url: 'https://www.spotify.com', name: 'Spotify' }],
      ['amazon', { url: 'https://www.amazon.com', name: 'Amazon' }],
      ['github', { url: 'https://www.github.com', name: 'GitHub' }],
      ['reddit', { url: 'https://www.reddit.com', name: 'Reddit' }],
      ['wikipedia', { url: 'https://www.wikipedia.org', name: 'Wikipedia' }],
      ['gmail', { url: 'https://www.gmail.com', name: 'Gmail' }],
      ['whatsapp', { url: 'https://web.whatsapp.com', name: 'WhatsApp Web' }],
    ]);

    this.systemCommands = new Map([
      ['time', this.getTime],
      ['date', this.getDate],
      ['name', this.getName],
      ['battery', this.getBattery],
    ]);

    this.openTriggers = ['open', 'go to', 'visit', 'launch', 'start', 'show me'];
    this.searchTriggers = ['search', 'find', 'look for', 'google'];
    this.imageTriggers = ['generate image', 'create image', 'make image', 'draw', 'generate picture', 'create picture'];
  }

  // Image generation function
  async generateImageCommand(command, context) {
    const { speak, setResponse, setPrompt, setSpeaking, setWaitingForClick, setGeneratedImage } = context;

    let imagePrompt = command;
    for (const trigger of this.imageTriggers) {
      if (command.includes(trigger)) {
        imagePrompt = command.toLowerCase().replace(trigger, '').trim();
        break;
      }
    }

    imagePrompt = imagePrompt.replace(/^(of|for|a|an)\s+/, '').trim();

    if (!imagePrompt) {
      speak("Please tell me what image you want me to generate");
      setResponse(true);
      setPrompt("Please specify what image to generate");
      setTimeout(() => setSpeaking(false), 3000);
      return true;
    }

    try {
      speak(`Generating image of ${imagePrompt}. Please wait...`);
      setResponse(true);
      setPrompt(`Generating image: "${imagePrompt}"`);

      const imageUrl = await generateImage(imagePrompt);

      speak(`Image generated successfully! Here's your ${imagePrompt}`);
      setPrompt(`Generated: ${imagePrompt}`);

      if (setGeneratedImage) {
        setGeneratedImage(imageUrl);
      }

      setWaitingForClick(true);
      return true;
    } catch (error) {
      console.error('Image generation failed:', error);
      speak("Sorry, I couldn't generate that image. Please try again.");
      setResponse(true);
      setPrompt("Image generation failed");
      setTimeout(() => setSpeaking(false), 5000);
      return true;
    }
  }

  isImageCommand(command) {
    return this.imageTriggers.some(trigger => command.includes(trigger));
  }

  openWebsite(url, name, context) {
    const { speak, setResponse, setPrompt, setSpeaking } = context;

    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        speak(`Please allow pop-ups to open ${name} in new tab`);
        setResponse(true);
        setPrompt(`Pop-ups blocked. Enable pop-ups for ${name}`);
      } else {
        speak(`Opening ${name} in new tab`);
        setResponse(true);
        setPrompt(`Opening ${name} in new tab...`);
      }

      setTimeout(() => setSpeaking(false), 3000);
      return true;
    } catch (error) {
      console.error('Error opening website:', error);
      speak(`Sorry, I couldn't open ${name}`);
      setResponse(true);
      setPrompt(`Failed to open ${name}`);
      setTimeout(() => setSpeaking(false), 3000);
      return false;
    }
  }

  similarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  findBestWebsiteMatch(command) {
    let bestMatch = null;
    let bestScore = 0;

    for (const [key, website] of this.websites) {
      if (command.includes(key)) {
        return { key, ...website, score: 1 };
      }

      const score = this.similarity(command, key);
      if (score > bestScore && score > 0.6) {
        bestMatch = { key, ...website, score };
        bestScore = score;
      }
    }

    return bestMatch;
  }

  isOpenCommand(command) {
    return this.openTriggers.some(trigger => command.includes(trigger));
  }

  isSearchCommand(command) {
    return this.searchTriggers.some(trigger => command.includes(trigger));
  }

  getTime = (context) => {
    const { speak, setResponse, setPrompt, setSpeaking } = context;
    const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
    speak(time);
    setResponse(true);
    setPrompt(time);
    setTimeout(() => setSpeaking(false), 5000);
  }

  getDate = (context) => {
    const { speak, setResponse, setPrompt, setSpeaking } = context;
    const date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
    speak(date);
    setResponse(true);
    setPrompt(date);
    setTimeout(() => setSpeaking(false), 5000);
  }

  getName = (context) => {
    const { speak, setResponse, setPrompt, setWaitingForClick, ASSISTANT_NAME } = context;
    speak(`My name is ${ASSISTANT_NAME}`);
    setResponse(true);
    setPrompt(`My name is ${ASSISTANT_NAME}`);
    setWaitingForClick(true);
  }


  getBattery = (context) => {
    const { speak, setResponse, setPrompt, setSpeaking } = context;
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
  }

  async processCommand(command, context) {
    const { speak, setResponse, setPrompt, setSpeaking, setWaitingForClick, setAssistantName, aiResponse } = context;

    if (command.includes("change name to")) {
      const newName = command.split("change name to ")[1];
      setAssistantName(newName);
      speak(`Okay, I'll be ${newName} from now on`);
      return true;
    }

    if (this.isImageCommand(command)) {
      return await this.generateImageCommand(command, context);
    }

    for (const [key, handler] of this.systemCommands) {
      if (command.includes(key)) {
        handler(context);
        return true;
      }
    }

    if (this.isOpenCommand(command)) {
      const match = this.findBestWebsiteMatch(command);
      if (match) {
        return this.openWebsite(match.url, match.name, context);
      }
    }

    if (this.isSearchCommand(command)) {
      const searchQuery = command.replace(/^(search|find|look for|google)\s+/i, '');
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      return this.openWebsite(searchUrl, `Search results for "${searchQuery}"`, context);
    }

    aiResponse(command);
    return false;
  }
}

export default CommandProcessor;
