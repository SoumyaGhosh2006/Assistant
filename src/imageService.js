// imageService.js

const HUGGING_FACE_API_KEY = "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";
const IMAGE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

// Pollinations API (optional fallback)
const POLLINATIONS_API_URL = "https://image.pollinations.ai/prompt/";

export async function generateImageWithHuggingFace(prompt) {
  try {
    const response = await fetch(IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, bad quality, distorted",
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: 512,
          height: 512
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API Error: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('❌ Error generating image with Hugging Face:', error);
    throw error;
  }
}

export async function generateImageWithPollinations(prompt) {
  try {
    const cleanPrompt = encodeURIComponent(prompt.trim());
    const imageUrl = `${POLLINATIONS_API_URL}${cleanPrompt}?width=512&height=512&model=flux&nologo=true`;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(imageUrl);
      img.onerror = () => reject(new Error('Pollinations image failed to load'));
      img.src = imageUrl;
    });
  } catch (error) {
    console.error('❌ Error generating image with Pollinations:', error);
    throw error;
  }
}

// Main function to generate image using Hugging Face first, then Pollinations
export async function generateImage(prompt) {
  // First try Hugging Face (preferred if key is set)
  if (HUGGING_FACE_API_KEY && HUGGING_FACE_API_KEY.startsWith("hf_")) {
    try {
      return await generateImageWithHuggingFace(prompt);
    } catch (error) {
      console.warn("⚠️ Hugging Face failed, trying Pollinations as fallback...");
    }
  }

  // Fallback to Pollinations
  try {
    return await generateImageWithPollinations(prompt);
  } catch (error) {
    console.error("❌ All image generation methods failed.");
    throw new Error("Image generation failed. Please try again.");
  }
}
