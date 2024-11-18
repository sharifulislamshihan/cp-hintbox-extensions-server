const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { GoogleGenerativeAI } = require('@google/generative-ai');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || '');

// Define the model
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

app.post('/geminiapi', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {

        // Generate content using the model
        const result = await model.generateContent(prompt);

        // Get the message from the result
        const generatedMessage = await result.response.text();

        res.json(generatedMessage);


    }
    catch (error) {
        console.error("Error contacting Gemini API:", error.message);
        res.status(500).json({ error: "Failed to process request." });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});