import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateModuleContent = async (content) => {
    try {
        // Validate API key
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      You are an expert educational content creator. Your task is to analyze the provided learning content and generate structured learning materials.
      
      Content to analyze:
      "${content.substring(0, 20000)}" // Limit content length to avoid token limits if necessary

      Please generate a JSON object with the following structure:
      {
        "summary": "A concise summary of the content (approx 100-150 words)",
        "concepts": ["Key concept 1", "Key concept 2", "Key concept 3", ...],
        "flashcards": [
          { "front": "Question or Term", "back": "Answer or Definition" },
          ... (at least 5 flashcards)
        ],
        "quiz": [
          {
            "question": "Quiz question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": 0 // Index of the correct option (0-3)
          },
          ... (at least 3 quiz questions)
        ]
      }

      IMPORTANT: Return ONLY the raw JSON string. Do not include markdown formatting like \`\`\`json or \`\`\`.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("AI Response received, length:", text.length);

        // Clean up potential markdown formatting if the model adds it despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        console.log("Attempting to parse JSON...");
        const parsedContent = JSON.parse(cleanText);
        console.log("✅ Successfully generated AI content");
        
        return parsedContent;
    } catch (error) {
        console.error("Error generating AI content:", error);
        console.error("Error details:", error.message);
        
        // Return fallback content if AI generation fails
        const fallbackContent = {
            summary: "AI content generation temporarily unavailable. This is a placeholder summary of your content that will be replaced when the AI service is restored.",
            concepts: ["Key concept from your content", "Main topic", "Important point"],
            flashcards: [
                { front: "What is the main topic?", back: "Based on your uploaded content" },
                { front: "Key takeaway", back: "Important information from your material" },
                { front: "Review question", back: "Answer based on content" }
            ],
            quiz: [
                {
                    question: "What is the main focus of this content?",
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correct: 0
                },
                {
                    question: "Which concept is most important?",
                    options: ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
                    correct: 0
                }
            ]
        };
        
        console.log("Returning fallback content due to AI service error");
        return fallbackContent;
    }
};
