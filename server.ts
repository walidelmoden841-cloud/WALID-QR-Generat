import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON schema for social media post generations
const postGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    linkedin: {
      type: Type.OBJECT,
      properties: {
        text: { 
          type: Type.STRING, 
          description: "Long-form professional post with proper line breaks, paragraphs, conversational formatting, business emojis, and custom industry hashtags." 
        },
        imagePrompt: { 
          type: Type.STRING, 
          description: "Detailed description of a professional-themed graphic or visual corresponding to the article's tone. Ensure it specifies visual style (photo, illustration, graphic), lighting, composition, and contains strictly NO text or words in the image." 
        }
      },
      required: ["text", "imagePrompt"]
    },
    twitter: {
      type: Type.OBJECT,
      properties: {
        text: { 
          type: Type.STRING, 
          description: "Concise, punchy update tailored for Twitter/X, strictly within 280 characters limit, containing an engaging hook, smart content, and 1-2 relevant hashtags." 
        },
        imagePrompt: { 
          type: Type.STRING, 
          description: "An eye-catching, high-impact background or scene description for a Twitter post. Specifies high-contrast colors, modern aesthetic, with strictly NO text or words in the image." 
        }
      },
      required: ["text", "imagePrompt"]
    },
    instagram: {
      type: Type.OBJECT,
      properties: {
        text: { 
          type: Type.STRING, 
          description: "Visual-focused Instagram caption starting with a powerful hook, conversational paragraphs, and a clean paragraph-separated block of 5-8 hyper-relevant hashtags." 
        },
        imagePrompt: { 
          type: Type.STRING, 
          description: "A highly artistic, vibrant, and stunning image prompt optimal for an Instagram grid. Specifies rich visual details, lighting, mood, with strictly NO letters, words, or text." 
        }
      },
      required: ["text", "imagePrompt"]
    }
  },
  required: ["linkedin", "twitter", "instagram"]
};

// Image generation helper
async function generatePlatformImg(prompt: string, aspectRatio: "1:1" | "4:3" | "16:9") {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    let base64String: string | null = null;
    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          base64String = part.inlineData.data;
          break;
        }
      }
    }

    if (base64String) {
      return `data:image/png;base64,${base64String}`;
    }

    throw new Error("No inlineData image parts returned from Gemini API.");
  } catch (err: any) {
    console.error(`[Image Gen Error] Aspect ratio ${aspectRatio} failed. Details:`, err.message || err);
    // Graceful design-first placeholder that fits the prompt thematic
    const seedWord = encodeURIComponent(prompt.substring(0, 60).replace(/[^a-zA-Z0-9 ]/g, ''));
    
    // Choose correct dimensions for aspect ratio fallbacks
    let width = 600, height = 600;
    if (aspectRatio === "16:9") { width = 960; height = 540; }
    else if (aspectRatio === "4:3") { width = 800; height = 600; }

    return `https://picsum.photos/seed/${seedWord || 'social'}/${width}/${height}`;
  }
}

// API Routes
app.post('/api/generate', async (req, res) => {
  try {
    const { idea, tone } = req.get('Content-Type')?.includes('json') ? req.body : {};

    if (!idea || !idea.trim()) {
      return res.status(400).json({ error: "Please provide a social media post idea or topic." });
    }

    const chosenTone = tone || 'professional';
    console.log(`Generating posts for idea: "${idea}" with Tone: "${chosenTone}"`);

    const promptMessage = `You are an expert multi-platform brand content strategist. 
Convert this raw idea into high-performing, ready-to-publish updates:
Topic/Idea: "${idea}"
Desired Tone: "${chosenTone}"

Strict Specifications:
1. LinkedIn Post: Long-form, conversational, business-value focused, uses lists or bullet points, adds 3 target hashtags.
2. Twitter/X Post: Under 280 characters, highly hook-oriented, conversational, with 1-2 hashtags.
3. Instagram Caption: Starts with a bold caption hook, followed by conversational body text, and a pristine block of 5-8 relevant hashtags separated at the bottom.
4. Each post must also have a specific, high-quality, descriptive text prompt for an AI image generator (e.g., 'gemini-2.5-flash-image'). The prompt must clearly set the scene, composition, colors, and lighting without referencing words, text, or letters in the image itself.`;

    // 1. Generate core posts and image prompts using gemini-3.5-flash
    const textResponse = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptMessage,
      config: {
        responseMimeType: 'application/json',
        responseSchema: postGenerationSchema,
        systemInstruction: "You are a professional social media assistant. Output strictly clean JSON conforming to the requested schema. Do not output markdown code blocks wrapped with backticks inside the JSON value strings."
      }
    });

    const contentText = textResponse.text;
    if (!contentText) {
      throw new Error("Failed to generate content from Gemini API.");
    }

    const brandData = JSON.parse(contentText.trim());

    // 2. Generate custom images for each platform in parallel with correct aspect ratios
    console.log("Generating platform-specific custom images in parallel...");
    const [linkedinImg, twitterImg, instagramImg] = await Promise.all([
      generatePlatformImg(brandData.linkedin.imagePrompt, "4:3"),
      generatePlatformImg(brandData.twitter.imagePrompt, "16:9"),
      generatePlatformImg(brandData.instagram.imagePrompt, "1:1"),
    ]);

    // Construct unified payload
    res.json({
      linkedin: {
        text: brandData.linkedin.text,
        imagePrompt: brandData.linkedin.imagePrompt,
        imageUrl: linkedinImg
      },
      twitter: {
        text: brandData.twitter.text,
        imagePrompt: brandData.twitter.imagePrompt,
        imageUrl: twitterImg
      },
      instagram: {
        text: brandData.instagram.text,
        imagePrompt: brandData.instagram.imagePrompt,
        imageUrl: instagramImg
      }
    });

  } catch (error: any) {
    console.error("[Backend handler error]:", error);
    res.status(500).json({ 
      error: "Failed to generate social media updates. Please check your inputs or try again.",
      details: error.message || error
    });
  }
});

// Dev server and static file hosting
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started successfully on port ${PORT}`);
});
