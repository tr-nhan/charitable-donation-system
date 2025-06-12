const { CohereClientV2 } = require("cohere-ai");
require("dotenv").config();

const cohere = new CohereClientV2({
    token: process.env.COHERE_AI_API
});

const useCohere = async (prompt) => {
    const response = await cohere.chat({
        model: "command-a-03-2025",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return response.message.content[0].text
};

module.exports = useCohere;
