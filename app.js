const express = require('express');
const { OpenAI } = require('openai');

const app = express();
app.use(express.json());

const OLLAMA_BASE_URL = 'http://localhost:11434/v1';

const client = new OpenAI({
    baseURL: OLLAMA_BASE_URL,
    apiKey: "ollama",
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message cannot be empty" });
    }

    try {
        const response = await client.chat.completions.create({
            model: "llama2",
            messages: [
                { role: "user", content: message }
            ],
            max_tokens: 150,
        });

        const botReply = response.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
