const axios = require("axios");
require("dotenv").config();
const useCohere = require("../config/cohereAI.js");

const enhanceText = async (req, res) => {
    const text = req.body.text;

    if (!text) return res.status(400).json({ error: 1, message: "Missing some required fields" });

    try {
        const prompt = `
            You are an AI writing assistant helping to improve a charity campaign description written in HTML format.

            Instructions:
            - Enhance the content to make it more professional, emotional, and grammatically correct.
            - Improve clarity, tone, and word choice.
            - Preserve all HTML tags and structure exactly as they are (do not remove or modify tags).
            - Only change the textual content within the tags.

            Here is the original HTML content:
            ${text}
        `;

        let response = await useCohere(prompt);

        res.json({ error: 0, results: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = {
    enhanceText
};
