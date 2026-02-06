const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/generate', async (req, res) => {
    const API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";

    try {
        // Step 1: Discover available model
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const listRes = await axios.get(listUrl);
        const targetModel = listRes.data.models.find(m => m.supportedGenerationMethods.includes("generateContent") && m.name.includes("flash"));
        
        const genUrl = `https://generativelanguage.googleapis.com/v1beta/${targetModel.name}:generateContent?key=${API_KEY}`;

        // Step 2: The Advanced Prompt
        const prompt = `Act as an Educational Psychologist. Create a unique academic resilience assessment. 
        1. Write a 2-sentence crisis scenario for a student. 
        2. Generate exactly 30 unique questions (actions) a student might take in response to THIS specific scenario.
        3. For each question, assign it one of these categories: 'perseverance', 'helpSeeking', or 'negativeAffect'.
        4. For 'negativeAffect' items, set 'isReverse' to true.
        
        OUTPUT ONLY VALID JSON in this format:
        {
          "scenario": "string",
          "questions": [
            {"id": 1, "text": "string", "category": "string", "isReverse": boolean},
            ... up to 30
          ]
        }`;

        const response = await axios.post(genUrl, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" } // Forces JSON output
        });

        const data = JSON.parse(response.data.candidates[0].content.parts[0].text);
        console.log("✅ AI fully generated scenario and 30 questions!");
        res.json(data);

    } catch (err) {
        console.error("❌ AI Generation Error:", err.message);
        // Basic fallback so the quiz never breaks
        res.json({
            scenario: "You just failed a major final project and your professor refuses to give you an extension. How would you react?",
            questions: Array.from({length: 30}, (_, i) => ({
                id: i + 1,
                text: `Action plan item ${i + 1} for this setback`,
                category: i < 10 ? 'perseverance' : (i < 20 ? 'helpSeeking' : 'negativeAffect'),
                isReverse: i >= 20
            }))
        });
    }
});

module.exports = router;